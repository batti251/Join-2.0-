/**
 * Initializes contacts object with database entries
 *
 * @returns {Promise<void>} A promise that resolves when contacts and task array are initialised completely.
 */
async function initContacs() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  await renderContactsList();
}

/**
 * Shows add-new-contact overlay.
 *
 */
function showAddContactScreen() {
  blurBackground();
  openContactOverlay("add-contact");
}

/**
 * Opens contact overlay
 *
 * @param {string} mode Mode of contact overlay
 * @param {integer} indexContact
 */
function openContactOverlay(mode, indexContact = null) {
  document.body.style.overflow = "hidden";
  let contactScreenRef = document.getElementById("contact-card");
  contactScreenRef.style.display = "flex";
  setTimeout(() => {
    manageRenderContactOverlay(mode, indexContact);
    setVisibilityAddContactMobileBtn("hidden");
  }, 10);
  setTimeout(() => {
    document.body.style.overflow = "auto";
  }, 500);
  /* document.getElementById("back-to-contacts-list-btn").classList.add("d-none"); */
}

/**
 * Renders contact overlay according to required mode
 *
 * @param {string} mode Modue of contact overlay
 * @param {integer} indexContact
 */
function manageRenderContactOverlay(mode, indexContact) {
  let contactScreenRef = document.getElementById("contact-card");
  contactScreenRef.classList.add("overlay-open");
  contactScreenRef.innerHTML = "";
  if (mode === "add-contact") {
    contactScreenRef.innerHTML = getAddContactsScreenTemplate();
  }
  if (mode === "edit-contact") {
    contactScreenRef.innerHTML = getEditContactScreenTemplate(indexContact);
    prefillContactInputFields(indexContact);
  }
}

/**
 * Closes any overlay at the contacts page.
 *
 */
function closeContactOverlays() {
  document.body.style.overflow = "hidden";
  let contactScreenRef = document.getElementById("contact-card");
  contactScreenRef.classList.remove("overlay-open");
  document.getElementById("bg-dimmed").classList.remove("dim-active");
  setVisibilityAddContactMobileBtn("visible");
  setTimeout(() => {
    contactScreenRef.style.display = "none";
    document.body.style.overflow = "auto";
    /*  document.getElementById("back-to-contacts-list-btn").style.display = ""; */
  }, 500);
}

/**
 * Shows the edit contact screen.
 *
 */
function showEditContactScreen(indexContact) {
  blurBackground();
  openContactOverlay("edit-contact", indexContact);
}

/**
 * Clears the add contact input form.
 *
 */
function clearAddContactForm(htmlIdPrefix) {
  let nameRef = document.getElementById(htmlIdPrefix + "name");
  let emailRef = document.getElementById(htmlIdPrefix + "email");
  let phoneRef = document.getElementById(htmlIdPrefix + "phone");
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

/**
 * Renders the contacts list
 *
 */
async function renderContactsList() {
  contactsArray = await getSortedContactsArray();
  let contactsListRef = document.getElementById("contacts-list");
  contactsListRef.innerHTML = "";
  for (let i = 0; i < contactsArray.length; i++) {
    if (contactHasFirstLetterPredecessor(i)) {
      contactsListRef.innerHTML += getContactsListContactTemplate(i);
    } else {
      contactsListRef.innerHTML += getContactListBookmarkTemplate(i);
      contactsListRef.innerHTML += getContactsListContactTemplate(i);
    }
  }
  getContactFromURL();
}

/**
 * Gets Query Parameter from URL to open contact-card directly
 * This is used when profil-link was clicked on task-overlay frfom {@link getTaskOverlay()}
 */
function getContactFromURL() {
  let queryID = window.location.search.split("=")[1];
  let contactIndex = contactsArray.findIndex((e) => e[0] == queryID);
  if (contactIndex > -1) {
    showContactDetails(contactIndex);
  }
}

/**
 * Renders the details section of a contact
 *
 * @param {integer} indexContact
 */
function renderContactDetails(indexContact) {
  clearContactDetails();
  if (window.innerWidth < 1260) {
    renderContactDetailsMobileWindow(indexContact);
  } else {
    document.body.style.overflow = "hidden";
    renderContactDetailsDesktopWindow(indexContact);
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 500);
  }
}

/**
 * Renders contact details for desktop screen widths
 *
 * @param {integer} indexContact
 */
function renderContactDetailsDesktopWindow(indexContact) {
  let contactDetailsRef = document.getElementById("contact-details");
  contactDetailsRef.style.display = "none";
  contactDetailsRef.classList.remove("contact-details-show");
  setTimeout(() => {
    contactDetailsRef.innerHTML = getContactDetailsTemplate(indexContact);
    contactDetailsRef.style.display = "flex";
  }, 10);
  setTimeout(() => {
    contactDetailsRef.classList.add("contact-details-show");
  }, 250);
}

/**
 * Clears the contact details panel
 */
function clearContactDetails() {
  document.getElementById("contact-details").innerHTML = "";
  document.getElementById("contact-details-mobile").innerHTML = "";
}

/**
 * Shows a contacts details.
 *
 * @param {integer} indexContact
 */
function showContactDetails(indexContact) {
  removeFocusFromAllContacts();
  addFocusToContact(indexContact);
  renderContactDetails(indexContact);
}

/**
 * Removes the focus class from all contact list entries
 */
function removeFocusFromAllContacts() {
  contactsListTagsRef = document.getElementsByClassName(
    "contact-list-item-wrap",
  );
  for (let i = 0; i < contactsListTagsRef.length; i++) {
    contactsListTagsRef[i].classList.remove("focus");
  }
}

/**
 * Adds the focus to the selected contact list entry.
 *
 * @param {integer} indexContact
 */
function addFocusToContact(indexContact) {
  let elementId = "contacts-list-" + String(indexContact);
  document.getElementById(elementId).classList.add("focus");
}

/**
 * Renders contact details for mobile screen widths
 *
 * @param {integer} indexContact
 */
function renderContactDetailsMobileWindow(indexContact) {
  let contactDetailsRef = document.getElementById("contact-details-mobile");
  document.getElementById("contacts-list-wrap").classList.add("d-none");
  contactDetailsRef.innerHTML = getContactDetailsTemplate(indexContact);
  document.getElementById("back-to-contacts-list-btn").style.display = "block";
  document.getElementById("contact-details-mobile-wrap").style.display =
    "block";
  document.getElementById("edit-contact-btn-mobile").style.display = "flex";
  renderContactDetailsMobileMenu(indexContact);
}

/**
 * Renders contact details mobile menu
 *
 * @param {integer} indexContact
 */
function renderContactDetailsMobileMenu(indexContact) {
  mobileMenuRef = document.getElementById("contact-details-mobile-menu");
  mobileMenuRef.innerHTML = "";
  mobileMenuRef.innerHTML = getContactDetailsMobileMenuTemplate(indexContact);
}

/**
 * Closes contact details mobile overlay and returns users view back to contacts list
 *
 */
function backToContactsList() {
  document.getElementById("contacts-list-wrap").classList.remove("d-none");
  document.getElementById("back-to-contacts-list-btn").style.display = "none";
  document.getElementById("contact-details-mobile-wrap").style.display = "none";
  document.getElementById("edit-contact-btn-mobile").style.display = "none";
}

/**
 * Shows contact details mobile menu
 */
function showContactDetailsMobileMenu() {
  document.getElementById("contact-details-mobile-menu").style.display =
    "block";
}

/**
 * Closes contact details mobile Menu
 */
function closeContactDetailsMobileMenu() {
  document.getElementById("contact-details-mobile-menu").style.display = "none";
}

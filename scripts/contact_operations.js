let user = new User();

/**
 * Returns an array alphabetically sorted by name.
 *
 * @async
 * @returns {Promise<Array<[string,Object]>>} A promise that resolves to an array of [id, contact] pairs sorted by name.
 */
async function getSortedContactsArray() {
  let contacts = await getDataBaseElement("contacts");
  contactsArray = Object.entries(contacts);
  contactsArray.sort((idValuePairA, idValuePairB) => {
    const nameA = idValuePairA[1].name.toLowerCase();
    const nameB = idValuePairB[1].name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  return contactsArray;
}




async function addNewContact() {
  event.preventDefault()
  user.buildNewUser()
  await submitObjectToDatabase("contacts", user);
  await renderContactsList();
  closeContactOverlays();
  removeFocusFromAllContacts();
  let addedContactIndex = getContactIndexByEmail(user.email);
  showContactDetails(addedContactIndex);
  showToastMessage("contact-created-toast-msg");
}


/**
 * Updates the current contact information on the firebase server
 *
 * @param {integer} indexContact
 */
async function updateContact(indexContact) {
  if (!regexValidation()) {
    return;
  }
  let htmlIdPrefix = "input-" + String(indexContact) + "-";
  let editedContactData = getToEditContactInformation(htmlIdPrefix);
  let contactPath = "contacts/" + contactsArray[indexContact][0];
  await patchDatabaseObject(contactPath, editedContactData);
  await renderContactsList();
  renderContactDetails(indexContact);
  closeContactOverlays();
  showToastMessage("contact-updated-toast-msg");
}

/**
 * creates the contact Object for PUT Request from {@link updateContact}
 * @param {*} htmlIdPrefix 
 * @returns 
 */
function getToEditContactInformation(htmlIdPrefix) {
  let nameRef = document.getElementById(htmlIdPrefix + "name");
  let emailRef = document.getElementById(htmlIdPrefix + "email");
  let phoneRef = document.getElementById(htmlIdPrefix + "phone");
  let contactData = {
    name: nameRef.value,
    email: emailRef.value,
    phone: phoneRef.value,
  };
  clearAddContactForm(htmlIdPrefix);
  return contactData;
}

/**
 * Deletes a contact from firebase server
 *
 * @param {integer} indexContact
 */
async function deleteContact(indexContact) {
  let contactId = contactsArray[indexContact][0];
  await deleteContactFromTasks(contactId);
  let path = "contacts/" + contactId;
  responseMessage = await deleteDataBaseElement(path);
  clearContactDetails();
  await renderContactsList();
  closeContactOverlays();
  showToastMessage("delete-contact-toast-msg");
}

/**
 * Deletes contact from all assigned tasks in board.
 *
 * @param {string} contactFirebaseId
 */
async function deleteContactFromTasks(contactFirebaseId) {
  let taskIdassignedToIdTupels = await findTaskIdAssignedToIdTupels(
    contactFirebaseId
  );
  for (let indexId = 0; indexId < taskIdassignedToIdTupels.length; indexId++) {
    let path =
      "/tasks/" +
      taskIdassignedToIdTupels[indexId].taskId +
      "/assignedTo/" +
      taskIdassignedToIdTupels[indexId].assignedToId;
    await deleteDataBaseElement(path);
  }
  tasksArray = await getTasksArray();
}

/**
 * Sets a CSS property value of the add contact mobile button
 *
 * @param {string} property A CSS property
 */
function setVisibilityAddContactMobileBtn(property) {
  let mobileButtonRef = document.getElementById("add-new-contact-btn-mobile");
  mobileButtonRef.style.visibility = property;
}

/**
 * Prefills all input fields of add contact form with current values stored on firebase server.
 *
 * @param {integer} indexContact
 */
async function prefillContactInputFields(indexContact) {
  prefillContactInputField("name", indexContact);
  prefillContactInputField("email", indexContact);
  prefillContactInputField("phone", indexContact);
}

/**
 * Prefills an input field of the add contact form with the respective current value stored on firebase server.
 *
 * @param {string} inputHtmlId Id of contact input html element
 * @param {string} attributeName Contact attribute name, either "name", "email" or "phone"
 * @param {integer} indexContact
 */
async function prefillContactInputField(attributeName, indexContact) {
  let inputHtmlId = "input-" + String(indexContact) + "-" + attributeName;
  let inputFieldRef = document.getElementById(inputHtmlId);
  inputFieldRef.value = await getCurrentContactAttribute(
    attributeName,
    indexContact
  );
}

/**
 * Gets the current contact attribute from firebase server
 *
 * @param {string} attribute Contact attribute either name, email or phone
 * @param {integer} indexContact
 * @returns Current contact attribute
 */
async function getCurrentContactAttribute(attribute, indexContact) {
  let contactId = contactsArray[indexContact][0];
  let path = "contacts/" + contactId + "/" + attribute;
  currentAttribute = await getDataBaseElement(path);
  return currentAttribute;
}

/**
 * Returns contact index inside of contactsArray by contact email.
 *
 * @param {string} contactEmail
 * @returns {integer} index of contact with above email inside contactsArray
 */
function getContactIndexByEmail(contactEmail) {
  let index = contactsArray.findIndex(
    (contact) => contact[1].email === contactEmail
  );
  return index;
}



/**
 * Checks whether contact in contact list has a first letter predecessor. If the contact has a first letter predecessor there is no need for an additional contact list bookmark related to this contact
 *
 * @param {integer} indexContact
 * @returns {boolean} true if predecessor exists
 */
function contactHasFirstLetterPredecessor(indexContact) {
  if (indexContact == 0) {
    return false;
  } else if (
    firstLettersAreEqual(
      contactsArray[indexContact][1].name,
      contactsArray[indexContact - 1][1].name
    )
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Assigns a icon color to a contact
 *
 * @param {integer} indexContact
 * @returns {string}  CSS class with color property as string
 */
function getContactColorClassName(indexContact) {
  let index = indexContact % contactColorClasses.length;
  return contactColorClasses[index];
}

/**
 * Returns contact color class name by firebase server id
 *
 * @param {string} contactFirebaseId
 * @returns {string} name of CSS class
 */
function getContactColorClassNameByFirebaseId(contactFirebaseId) {
  if (!contactFirebaseId) {
    return "";
  } else {
    let indexContact = findContactIndexByFirebaseId(contactFirebaseId);
    let index = indexContact % contactColorClasses.length;
    return contactColorClasses[index];
  }
}

/**
 * Returns index of contact in contactsArray by contacts firebase Id
 *
 * @param {string} contactFirebaseId
 * @returns {integer} index of contact in contactsArray
 */
function findContactIndexByFirebaseId(contactFirebaseId) {
  if (!contactFirebaseId) {
    return "";
  } else {
    return contactsArray.findIndex(
      (contactEntry) => contactEntry[0] === contactFirebaseId
    );
  }
}

/**
 *
 * @param {string} contactFirebaseId
 * @returns {array} tupel of task Id and taks assigned to Id
 */
async function findTaskIdAssignedToIdTupels(contactFirebaseId) {
  tasksArray = await getTasksArray();
  let taskIdassignedToIdTupels = [];
  for (let indexTask = 0; indexTask < tasksArray.length; indexTask++) {
    let taskFirebaseId = tasksArray[indexTask][0];
    let taskValueObj = tasksArray[indexTask][1];
    if (!taskValueObj.assignedTo) continue;
    let assignedToObj = Object.fromEntries(taskValueObj.assignedTo);
    for (let assignedToId in assignedToObj) {
      let contactObj = assignedToObj[assignedToId];
      if (contactObj?.Id === contactFirebaseId) {
        taskIdassignedToIdTupels.push({
          taskId: taskFirebaseId,
          assignedToId: assignedToId,
        });
      }
    }
  }
  return taskIdassignedToIdTupels;
}

/**
 * This function retruns the contacts list contact tempate
 *
 * @param {integer} indexContact
 * @returns - HMTL template of a contact item in contacts list.
 */
function getContactsListContactTemplate(indexContact) {
  return `
    <div class="contact-list-item-wrap" onclick="showContactDetails(${indexContact})" id="contacts-list-${indexContact}">
        <div class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassName(
          indexContact,
        )}">${getFirstTwoStringInitialsByFirebaseId(
          contactsArray[indexContact][0],
        )}</div>
        <div class="contact-name-wrap d-flex-column">
            <div class="contact-name">${
              contactsArray[indexContact][1].name
            }</div>
            <div class="contact-email">${
              contactsArray[indexContact][1].email
            }</div>
        </div>
    </div>
  `;
}

/**
 * This function returns the contacts list bookmark template
 *
 * @param {integer} indexContact
 * @returns - HTML template of a contact list bookmark
 */
function getContactListBookmarkTemplate(indexContact) {
  return `
    <div class="bookmark-wrap d-flex-c">
          <div class="bookmark-letter">${contactsArray[indexContact][1].name
            .charAt(0)
            .toUpperCase()}</div>
    </div>
    <div class="bookmark-separator"></div>
    `;
}

/**
 * This function returns the contact details template.
 *
 * @param {integer} indexContact
 * @returns - HTML template of the contact details section
 */
function getContactDetailsTemplate(indexContact) {
  return `
    <div class="contact-details-icon-edit-name-wrap">
        <div class="${getContactColorClassName(
          indexContact,
        )} contact-details-name-icon">${getFirstTwoStringInitialsByFirebaseId(
          contactsArray[indexContact][0],
        )}
    </div>
    <div class="contact-details-name-wrap">
            <div class="contact-details-name">${
              contactsArray[indexContact][1].name
            }</div>
            <div class="contract-details-edit-delete-wrap">
                <button
                class="contact-details-edit-contact"
                onclick="showEditContactScreen(${indexContact})"
                >
                <img
                    src="../assets/icons/edit.svg"
                    alt="edit pencil"
                    class="edit-contact-icon"
                />
                <span class="edit-contact-text">Edit</span>
                </button>
                <button class="contact-details-delete-contact" onclick="deleteContact(${indexContact})">
                <img
                    src="../assets/icons/delete.svg"
                    alt="delete trash bin"
                    class="delete-contact-icon"
                />
                <span class="edit-contact-text">Delete</span>
                </button>
            </div>
            </div>
        </div>
        <div class="contact-information-text">Contact Information</div>
        <div class="contact-details-email-phone-wrap">
            <div class="contact-details-email-wrap">
            <span class="contact-details-category">Email</span>
            <a href="mailto:${
              contactsArray[indexContact][1].email
            }" class="contact-email">${contactsArray[indexContact][1].email}</a>
            </div>
            <div class="contact-details-email-wrap">
            <span class="contact-details-category">Phone</span>
            <a href="tel:" class="contact-details-phone text-color-black">${
              contactsArray[indexContact][1].phone
            }</a>
            </div>
        </div>
    </div>
              <button
            onclick="backToContactsList()"
            class="back-to-contacts-list-btn"
            id="back-to-contacts-list-btn"
          ></button>
  `;
}

function getContactDetailsMobileMenuTemplate(indexContact) {
  return `
    <div class="contact-details-btn-wrap">
    <button class="contact-details-edit-contact" onclick="showEditContactScreen(${indexContact})">
      <img
        src="../assets/icons/edit.svg"
        alt="edit pencil"
        class="edit-contact-icon"
      />
      <span class="edit-contact-text">Edit</span>
    </button>
    <button class="contact-details-delete-contact" onclick="deleteContact(${indexContact})">
      <img
        src="../assets/icons/delete.svg"
        alt="delete trash bin"
        class="delete-contact-icon"
      />
      <span class="edit-contact-text">Delete</span>
    </button>
  </div>
  `;
}

function getAddContactsScreenTemplate() {
  return `
        <div
          class="close-icon-wrap d-flex-row-c-c"
          onclick="closeContactOverlays()"
        >
          <span class="close-icon"></span>
        </div>
        <div class="add-contact-title-page">
          <img
            src="../assets/icons/join_icon.svg"
            alt="Join Logo"
            class="add-contacts-screen-logo mg-t-80px"
          />
          <div class="add-contacts-title-wrap">
            <div class="add-contacts-screen-title-text-wrap">
              <span class="add-contacts-screen-title-text">Add contact</span>
              <span class="add-contacts-screen-title-subtext"
                >Tasks are better with a team!</span
              >
            </div>
            <div class="add-contacts-title-page-hline"></div>
          </div>
        </div>
        <div class="d-flex-row-c-c p-relative">
          <div class="add-contact-badge-wrap d-flex-row-c-c">
            <img
              src="../assets/icons/person.svg"
              alt="person icon"
              class="add-contact-badge"
            />
          </div>
        </div>
        <div class="add-contact-input-check d-flex-column-c-c">
          <form id="add-contact-form" novalidate class="add-contacts-form-wrap" onsubmit="addNewContact()">
          <div class=" input-container"> 
          <div class="add-contact-input-wrap">           
            <input
                type="text"
                class="add-contact-input required"
                placeholder="Name"
                id="add-contact-input-name"
                name="name"
                oninput="resetErrorMessage()"
              />
              <img
                src="../assets/icons/person_icon.svg"
                alt="person-icon"
                class="add-contact-input-icon"
              />
              </div>
               <div class="d-none validation">This field is required!</div>

               </div>
            <div class="input-container ">
            <div class=""> 
            <div class="add-contact-input-wrap">
              <input
                type="email"
                class="add-contact-input required"
                placeholder="Email"
                id="add-contact-input-email"
                name="email"
                oninput="resetErrorMessage()"
              />
              <img
                src="../assets/icons/mail_icon.svg"
                alt="email-icon"
                class="add-contact-input-icon"
              /> 
             </div>  
              <div class="d-none validation">This field is required!</div>
              <div id="email-error" class="d-none validation email">Please enter a valid e-mail address</div>
            </div>  
 </div>
            <div class="input-container ">
            <div class="add-contact-input-wrap">
              <input
                type="tel"
                class="add-contact-input"
                placeholder="Phone"
                name="phone"
                id="add-contact-input-phone"
                oninput="resetErrorMessage()"
              />
              <img
                src="../assets/icons/call.svg"
                alt="call icon"
                class="add-contact-input-icon"
              />
            </div>
              <div id="phone-error" class="d-none validation email">Please enter a valid phone number</div>
            </div>

            <div class="add-contact-btns-wrap">
              <button
                type="button"
                onclick="closeContactOverlays()"
                class="add-contact-btn-cancel"
              >
                <span>Cancel</span>
                <img
                  src="../assets/icons/cancel.svg"
                  alt="cancel"
                  class="add-contact-btn-icon-cancel"
                  onmouseover="this.src='/assets/icons/close-blue.svg';"
                  onmouseout="this.src='/assets/icons/cancel.svg';"
                />
              </button>
              <button type="submit" class="add-contact-btn">
                <span>Create contact</span>
                <img
                  src="../assets/icons/check_withoutBorder.svg"
                  alt="check"
                  class="add-contact-btn-icon-check"
                />
              </button>
            </div>
          </form>
        </div>
  `;
}

/**
 * This function returns the edit contact srceen template
 *
 * @param {integer} indexContact
 * @returns - HTML template for edit contact screen
 */
function getEditContactScreenTemplate(indexContact) {
  return `
          <div
            class="close-icon-wrap d-flex-row-c-c"
            onclick="closeContactOverlays()"
          >
            <span class="close-icon"></span>
          </div>
          <div class="add-contact-title-page">
            <img
              src="../assets/icons/join_icon.svg"
              alt="Join Logo"
              class="add-contacts-screen-logo mg-t-80px"
            />
            <div class="add-contacts-title-wrap">
              <div class="add-contacts-screen-title-text-wrap">
                <span class="add-contacts-screen-title-text text-color-white font-Inter-700-61px">Edit contact</span>
              </div>
              <div class="add-contacts-title-page-hline"></div>
            </div>
          </div>
          <div class="d-flex-row-c-c p-relative">
            <div class="${getContactColorClassName(
              indexContact,
            )} contact-badge-wrap d-flex-row-c-c">
              <div class="font-sz-47px">${getFirstTwoStringInitialsByFirebaseId(
                contactsArray[indexContact][0],
              )}</div>
            </div>
          </div>
          <div class="add-contact-input-check d-flex-column-c-c">
            <form id="edit-contact-form" novalidate class="add-contacts-form-wrap d-flex-column" onsubmit="updateContact(${indexContact}); event.preventDefault()">
            
            <div class="height-52px">
              <div class="add-contact-input-wrap d-flex-c-sb">
                <input
                  type="text"
                  class="add-contact-input required"
                  placeholder="Name"
                  id="input-${indexContact}-name"
                  name="name"
                  oninput="resetErrorMessage()"
                />
                <img
                  src="../assets/icons/person_icon.svg"
                  alt="person-icon"
                  class="add-contact-input-icon"
                />
                 </div>
                  <div class="d-none validation font-Inter-400-13px text-color-FF8190">This field is required!</div>
            </div>
              <div class="input-container d-flex-column">
              <div class="height-52px">
              <div class="add-contact-input-wrap d-flex-c-sb">
                <input
                  type="email"
                  class="add-contact-input required"
                  placeholder="Email"
                  name="email"
                  id="input-${indexContact}-email"
                  oninput="resetErrorMessage()"
                />
                <img
                  src="../assets/icons/mail_icon.svg"
                  alt="email-icon"
                  class="add-contact-input-icon"
                />
               </div>  
              <div class="d-none validation font-Inter-400-13px text-color-FF8190">This field is required!</div>
              <div id="email-error" class="d-none validation email font-Inter-400-13px text-color-FF8190">Please enter a valid e-mail address</div>
            </div>
              </div>
              <div class="input-container d-flex-column height-52px">
              <div class="add-contact-input-wrap d-flex-c-sb">
                <input
                  type="tel"
                  class="add-contact-input"
                  placeholder="Phone"
                  name="phone"
                  id="input-${indexContact}-phone"
                  oninput="resetErrorMessage()"
                />
                <img
                  src="../assets/icons/call.svg"
                  alt="call icon"
                  class="add contact-input-icon"
                />
              </div>
 <div id="phone-error" class="d-none validation email font-Inter-400-13px text-color-FF8190">Please enter a valid phone number</div>
</div>
              <div class="add-contact-btns-wrap">
                <button type="button" class="add-contact-btn-cancel bg-white text-color-2A3647" onclick="deleteContact(${indexContact})">
                  <span>Delete</span>
                </button>
                <button type="submit" class="add-contact-btn d-flex-row-c-c">
                  <span>Save</span>
                  <img
                    src="../assets/icons/check_withoutBorder.svg"
                    alt="check"
                    class="add-contact-btn-icon-check"
                  />
                </button>
              </div>
            </form>
          </div>
  `;
}

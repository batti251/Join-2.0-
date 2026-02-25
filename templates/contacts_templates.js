/**
 * This function retruns the contacts list contact tempate
 *
 * @param {integer} indexContact
 * @returns - HMTL template of a contact item in contacts list.
 */
function getContactsListContactTemplate(indexContact) {
  return `
    <div class="contact-list-item-wrap" onclick="showContactDetails(${indexContact})" id="contacts-list-${indexContact}">
        <div class="profile-badge ${getContactColorClassName(
          indexContact,
        )}">${getFirstTwoStringInitialsByFirebaseId(
          contactsArray[indexContact][0],
        )}</div>
        <div class="contact-name-wrap">
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
          class="close-icon-wrap"
          onclick="closeContactOverlays()"
        >
          <span class="close-icon"></span>
        </div>
        <div class="add-contact-title-page">
          <img
            src="../assets/icons/join_icon.svg"
            alt="Join Logo"
            class="add-contacts-screen-logo"
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
        <div class="add-contact-icon-seperator">
          <div class="add-contact-badge-wrap">
            <img
              src="../assets/icons/person.svg"
              alt="person icon"
              class="add-contact-badge"
            />
          </div>
        </div>
        <div class="add-contact-input-check">
          <form id="add-contact-form" novalidate class="add-contacts-form-wrap" onsubmit="addNewContact()">
          <div class=" input-container"> 
          <div class="add-contact-input-wrap">           
            <input
                type="text"
                class="add-contact-input validate"
                placeholder="Name"
                id="add-contact-input-name"
                pattern="\\p{L}+(?:[ \\-']\\p{L}+)*"
                name="name"
                oninput="resetErrorMessage()"
                required
              />
              <img
                src="../assets/icons/person_icon.svg"
                alt="person-icon"
                class="add-contact-input-icon"
              />
              </div>
               <div class="opacity-0 validation">This field is required!</div>

               </div>
            <div class="input-container ">
            <div class=""> 
            <div class="add-contact-input-wrap">
              <input
                type="email"
                class="add-contact-input validate"
                placeholder="Email"
                id="add-contact-input-email"
                pattern="^[a-zA-Z0-9._%+\\-]+@([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}$"
                name="email"
                required
                oninput="resetErrorMessage()"
              />
              <img
                src="../assets/icons/mail_icon.svg"
                alt="email-icon"
                class="add-contact-input-icon"
              /> 
             </div>  
              <div id="email-error" class="opacity-0 validation email">Please enter a valid, unused e-mail address</div>
            </div>  
 </div>
            <div class="input-container ">
            <div class="add-contact-input-wrap">
              <input
                type="tel"
                class="add-contact-input validate"
                pattern="^[0-9]{6,20}$"
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
              <div id="phone-error" class="opacity-0 validation email">Please enter a valid phone number</div>
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
  console.log(indexContact);
  console.log();
  
  return `
          <div
            class="close-icon-wrap"
            onclick="closeContactOverlays()"
          >
            <span class="close-icon"></span>
          </div>
          <div class="add-contact-title-page">
            <img
              src="../assets/icons/join_icon.svg"
              alt="Join Logo"
              class="add-contacts-screen-logo"
            />
            <div class="add-contacts-title-wrap">
              <div class="add-contacts-screen-title-text-wrap">
                <span class="add-contacts-screen-title-text">Edit contact</span>
              </div>
              <div class="add-contacts-title-page-hline"></div>
            </div>
          </div>
          <div class="add-contact-icon-seperator">
            <div class="${getContactColorClassName(
              indexContact,
            )} contact-badge-wrap">
              <div class="contact-badge-initial">${getFirstTwoStringInitialsByFirebaseId(
                contactsArray[indexContact][0],
              )}</div>
            </div>
          </div>
          <div class="add-contact-input-check">
            <form id="edit-contact-form" novalidate class="add-contacts-form-wrap" onsubmit="updateContact(${indexContact}, ${contactsArray[indexContact][1].canLogin}); event.preventDefault()">
            
            <div class="form-contact-input-wrap">
              <div class="add-contact-input-wrap">
                <input
                  type="text"
                  class="add-contact-input validate"
                  placeholder="Name"
                  pattern="\\p{L}+(?:[ \\-']\\p{L}+)*"
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
                  <div class="opacity-0 validation">This field is required!</div>
            </div>
              <div class="input-container">
              <div class="form-contact-input-wrap">
              <div class="add-contact-input-wrap">
              ${contactsArray[indexContact][1].canLogin ? `
                <input
                  disabled
                  type="email"
                  class="add-contact-input"
                  placeholder="Email"
                  id="input-${indexContact}-email"
                />
                <img
                  src="../assets/icons/mail_icon.svg"
                  alt="email-icon"
                  class="add-contact-input-icon"
                />
                </div>  
              <div id="email-error" class="opacity-1 validation email">User-accounts are not allowed to edit!</div>
            </div>` : `<input
                  type="email"
                  class="add-contact-input validate"
                  placeholder="Email"
                  pattern="^[a-zA-Z0-9._%+\\-]+@([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}$"
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
              <div id="email-error" class="opacity-0 validation email">Please enter a valid, unused e-mail address</div>
            </div>
            `}
                
               
              </div>
              <div class="input-container">
              <div class="add-contact-input-wrap">
                <input
                  type="tel"
                  class="add-contact-input validate"
                  placeholder="Phone"
                  pattern="^[0-9]{6,20}$"
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
 <div id="phone-error" class="opacity-0 validation email">Please enter a valid phone number</div>
</div>
              <div class="add-contact-btns-wrap">
                <button type="button" class="add-contact-btn-cancel" onclick="deleteContact(${indexContact})">
                  <span>Delete</span>
                </button>
                <button type="submit" class="add-contact-btn">
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

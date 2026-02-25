async function addNewContact() {
  event.preventDefault()
  if (!await validContact()) {
    return
  }

  user.buildNewUser("add-contact-form")
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
async function updateContact(indexContact, canLogin) {
  event.preventDefault()
  if (!await validContact(canLogin)) {
    return
  }

 let userID = contactsArray[indexContact][0]
  user.buildNewUser("edit-contact-form", indexContact, "editContact")
  await patchDatabaseObject(`contacts/${userID}`, user);
  await renderContactsList();
  renderContactDetails(indexContact);
  closeContactOverlays();
  showToastMessage("contact-updated-toast-msg");
}



/**
 * Deletes a contact from firebase server
 *
 * @param {integer} indexContact
 */
async function deleteContact(indexContact) {
  let userIndex = await user.validateUser();
  if (userIndex < 0) {
    showToastMessage("delete-contact-reject-msg") 
    return};
  let contactId = contactsArray[indexContact][0];
  await deleteContactFromTasks(contactId);
  await deleteDataBaseElement("contacts/" + contactId);
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

class User {
  name;
  email;
  phone;
  checkbox;
  password;
  canLogin;

  constructor(name, email, phone, checkbox, password, canLogin) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.checkbox = checkbox;
    this.password = password;
    this.canLogin = canLogin
  
  }




/**
 * Adds a new contact to the database.
 *
 */
buildNewUser() {
  
  let form = document.getElementById("add-contact-form");
    let formData = new FormData(form);
    this.getFormValues(formData, currentTask);

}
/* 
  if (!regexValidation()) {
    return;
  }
  let newContactData = getContactInformation("add-contact-input-");
  await submitObjectToDatabase("contacts", newContactData);
  await renderContactsList();
  closeContactOverlays();
  removeFocusFromAllContacts();
  let addedContactIndex = getContactIndexByEmail(newContactData.email);
  showContactDetails(addedContactIndex);
  showToastMessage("contact-created-toast-msg");
} */


  /**
   * This Function builds the tasks key-value pairs from the {@link buildNewTask()}
   * @param {Object} formData 
   */
  getFormValues(formData, currentTask) {
    for (const [key, value] of formData) {
      switch (key) {
        case "subtasks":
          this[key] = newTaskSubtasks;
          break;
        case "assignedTo":
          this.assignedToFunction();
          break;
        default:
          this[key] = value;
          break;
      }
      this.addContactMetaData()
    }
  }

addContactMetaData(){
    this.checkbox = "";
    this.password = "";
    this.canLogin = false
}






}


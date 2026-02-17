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
   *
   * @returns - returns contact Index from DB, or -1, when no User was found
   */
  async validateUser() {
    let validUser = contactsArray.findIndex((e) => e[0] == idUser);
    return validUser;
  }


/**
 * Adds a new contact to the database.
 *
 */
buildNewUser(id, indexContact) {
  let form = document.getElementById(id);
    let formData = new FormData(form);
    this.getFormValues(formData, indexContact);

}

  /**
   * This Function builds the tasks key-value pairs from the {@link buildNewTask()}
   * @param {Object} formData 
   */
  getFormValues(formData, indexContact) {
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
    }
    if (indexContact) {
      return
    }
    this.addContactMetaData()
  }

addContactMetaData(){
    this.checkbox = "";
    this.password = "";
    this.canLogin = false
}






}


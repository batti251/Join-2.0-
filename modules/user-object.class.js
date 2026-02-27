class User {
  name;
  email;
  phone = "";
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
buildNewUser(id, indexContact, hasSource) {
  let form = document.getElementById(id);
    let formData = new FormData(form);
    this.getFormValues(formData, indexContact, hasSource);
  /* console.log(newTaskSubtasks); */
  
}

  /**
   * This Function builds the tasks key-value pairs from the {@link buildNewTask()}
   * @param {Object} formData 
   */
  getFormValues(formData, indexContact, hasSource) {
    for (const [key, value] of formData) {
          this[key] = value;
      }
          if (hasSource == "patch") {
        this.addSignupMetaData()
      } else if (hasSource == "signup") {
        this.addSignupMetaData()
        this.phone = "";
      }
        
    if (indexContact < 1) {
      this.addContactMetaData()
    }
  }

/**
 * This Function makes the user-contact to an active account
 * This is set in {@link getNewUserInformation()}
 */
addSignupMetaData(){
    this.canLogin = true
}

  /**
   * Adds additional Data to the new user-object
   * This Function is only called, when no user is set up 
   */
addContactMetaData(){
    this.checkbox = "";
    this.password = "";
    this.canLogin = false
}






}


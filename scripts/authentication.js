/**
 * Function to log in as guest
 *
 */
function guestLogin() {
  saveSession("Gast");
  location.href = "summary.html";
}

/**
 * Function to forward user to signup page
 *
 */
function signupPage() {
  location.href = "./signup.html";
}

/**
 * Function to check the state of all required input fields and the acceptance checkbox.
 *
 */
function checkInput() {
  let checkbox = document.getElementById("accept-policy");
  let requiredInputs = document.querySelectorAll("input");
  let button = document.querySelector(".btn-primary");
  if (
    [...requiredInputs].every((input) => input.value !== "") &&
    checkbox.checked
  ) {
    button.removeAttribute("disabled");
  } else {
    button.setAttribute("disabled", "true");
  }
}

/**
 * Function to validate users credentials after button submit
 * Prevent if email is invalid, initial password too short, or passwords don't match
 *
 * @param {Event} event event-object to stop page-reload after submit
 */
async function signupFormValidation(event) {
  event.preventDefault();
  initMailObj()
  let userInput = document.getElementsByTagName("input");
   if (userInput[2].value !== userInput[3].value) {
     showErrorMessage("password", []); 
  }  
  console.log(await validSignup());
  
  if (await validSignup()) {
    getNewUserInformation();
    showMessage();
  }
}

/**
 * Mail-Handler for several authentication cases:
 * addContact: Handles contact adding
 * sameMailDBLookUp: true => both states (before editing | after edit-submit) have the same mail 
 *                   false => both states have different mails
 * hasUserAccount: true => the edit contact has a valid private account
 *                 false => the edit contact has not a valid private account
 * continueSubmit: flag to mark continue process 
 */
  function initMailObj() {
  editMailHandler = {
    sameMailDBLookUp: false,
    hasUserAccount: false,
    continueSubmit: false,
    addContact: false
  }
  }

/**
 * Function to create a new user account,
 * If a users mail-address already exists, it will update the dedicated user-entry
 * If the users mail-address does not exist, a new user will be submit
 *
 */
async function getNewUserInformation() {
  let mailUsed = await lookupMail();
      let hasUserAccount;
  if (mailUsed > -1) {
     hasUserAccount = contactsArray[mailUsed][1].canLogin
  } else 
    hasUserAccount = true
  if (!hasUserAccount) {
    user.buildNewUser("signup-form", 1 , "patch");
    await patchDatabaseObject(`contacts/${contactsArray[mailUsed][0]}`, user);
  } else {
    user.buildNewUser("signup-form",1, "signup");
    await submitObjectToDatabase("contacts", user);
  }
}


/**
 * This Function gives the User feedback, if signup was successful.
 * Also triggers to add a new contact
 *
 * @param {object} credentials object to
 */
async function showMessage(credentials) {
  let messageBox = document.querySelector(".signup-message");
  let blur = document.querySelector(".background-fade");
  let signup = document.querySelector(".login-container");
  messageBox.classList.remove("d-none");
  messageBox.classList.add("d-flex");
  blur.style.backgroundColor = "rgb(0, 0, 0, 0.10)";
  blur.style.zIndex = 2;
  signup.classList.add('index-1')
  setTimeout(() => {
    location.href = "./login.html";
  }, 1800);
}

/**
 * This function gets all users-credentials from database and triggers credential-check-function
 *
 * @param {string} path path of the database
 */
async function userLogin(path = "contacts") {
  let response = await fetch(database + path + ".json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let responseRef = await response.json();
  checkLogInCredentials(responseRef);
}

/**
 * Validates if the user has a proper login-account
 * @param {*} usersObj 
 * @param {*} loginMail 
 * @returns - true: when user has an active account
 *            false: when user has not an active account
 */
function userHasCredential(loginMail, validMails) {
  let valid = validMails.filter(i => i.email == loginMail)
  let isValid = valid.length > 0 
  return isValid
}

/**
 * This function checks, if login-credentials are valid to credentials from database
 *
 * @param {object} responseRef all user credentials from the database
 */
async function checkLogInCredentials(responseRef) {
  let loginInputRef = document.getElementsByTagName("input");
  let loginMail = loginInputRef[0].value;
  let userCanLogin = getCanLoginState(responseRef);
  let validMails = getCanLoginEntries(responseRef);
  let userID = setUserID(loginMail, responseRef);
  if (userCanLogin) {
    sendValidationCases(loginInputRef, validMails, userID)
  } else { 
    showErrorMessage("user-existance", [])
    return}
}

/**
 * called Function when valid userCanLogin from {@link checkLogInCredentials()}
 * It validates the users sent credentials
 * When Credentials are correct, userlogin will proceed, else error message will be displayed
 * @param {HTMLCollection} loginInputRef 
 * @param {Array} validMails 
 * @param {String} userID 
 */
function sendValidationCases(loginInputRef, validMails, userID) {
  let name = filterUserName(validMails, loginInputRef);
  let credentialsMerge = validMails.map((i) => { return i.email + i.password;}); // Liste, anmeldung & pw
  validCredentials = credentialsMerge.includes(loginInputRef[0].value + loginInputRef[1].value)
  if (validCredentials) {
    location.href = "/html/summary.html";
    saveSession(name, userID);
  } else {
    showErrorMessage("password", [...loginInputRef]);
  }
}

/**
 * This Functions returns the UserID from the mail-Input 
 * @param {String} loginMail 
 * @param {Array} validMails 
 * @returns - UserID or ""
 */
function setUserID(loginMail, responseRef) {
  getUsersObjRef = Object.entries(responseRef).filter(u => u[1].email == loginMail)
  return getUsersObjRef ? userID = getUsersObjRef[0][0] : "";
}

/**
 * This Functions prepares and returns the answer if the login-authentification was successful
 * @returns - Boolean - true: Authentification-process suceed
 *                    - false: Authentification-process failed
 */
function getCanLoginState(responseRef) {
  let loginInputRef = document.getElementsByTagName("input"); 
  let loginMail = loginInputRef[0].value
  let validMails = getCanLoginEntries(responseRef);
  return userHasCredential(loginMail, validMails)
}

/**
 * 
 * @param {Array*} responseRef - list of all active accounts
 * @returns 
 */
function getCanLoginEntries(responseRef) {
   let usersObj = Object.values(responseRef);
   return usersObj.filter(i => i.canLogin == true);
}

/**
 * This function filters the correct users name
 *
 * @param {*} usersObj current saved users and credentials in the databse
 * @param {*} loginInput the email and password input field
 * @returns the users name
 */
function filterUserName(usersObj, loginInput) {
  let correctuser = usersObj.filter((u) => u.email == loginInput[0].value);
  let user = correctuser.map((n) => n.name);
  return user;
}

/**
 * This function sets user credentials initials in session Storage
 *
 * @param {String} name the users name
 */
function saveSession(name, userID) {
  setSessionStorage("user", name[0]);
  setSessionStorage(
    "initials",
    name[0]
      .split(" ")
      .map((i) => i[0]?.toUpperCase())
      .join("")
  );
  setSessionStorage("id", userID)
}

/**
 * This Function handles the contact validations 
 * It's called from {@link addNewContact()} and {@link updateContact()}
 * @param {Boolean} canLogin - flag from user-entry (true: has active account ; false: has no active account => sign-in possible)
 * @param {*} indexContact 
 * @returns - states:   true = isAValidContact
 *                      false = notAValidContact 
 */
async function validContact(canLogin, indexContact) {
  initMailObj();
  let state = true;
  let errorRef = document.getElementById(`email-error`);
  if ( !await isMailUsable(indexContact) && !canLogin) {
   errorRef.innerHTML = "Mail already exist. Please take an unused email";
    return
  }  
  if (!await isValidUser()) {
    showToastMessage("add-contact-reject-msg") 
    return};
  if (!checkValidation()) {
    errorRef.innerHTML = "Please enter a valid, unused email";
    return 
  }
  return state
}

/**
 * This Function queries, if a user-entry has a valid mail and active account
 * This is used for sign-in
 * @param {*} indexContact 
 * @returns - returns boolean handler for continue Submit process
 */
async function isMailUsable(indexContact) {
  await lookupMail(indexContact);
   if (editMailHandler.continueSubmit) {
    return  editMailHandler    
  } 

  if (editMailHandler.sameMailDBLookUp === true) {
     return editMailHandler.continueSubmit = true 
  } 
    else if (editMailHandler.addContact){
    return editMailHandler.continueSubmit = true 
  }
    else if (!editMailHandler.sameMailDBLookUp) {
    showErrorMessage("email")
    return  editMailHandler.continueSubmit = false    
  } 
  
}

/**
 * This Function looks for stored mails, within the database
 * @param {Number} indexContact - index of the sorted contacts array
 * @returns - editMailHandler-Object from {@link initMailObj()}
 *          - proceeds with function {@link isMailUsable()} && {@link getNewUserInformation()}
 */
async function lookupMail(indexContact) {
  contactsArray = await getSortedContactsArray()
  let toValidate = document.querySelectorAll(".validate");
  let mailInputRef = [...toValidate].filter(e => e.name == "email")
  let mailInput = mailInputRef[0]?.value;
  let usedMails = contactsArray.map((e) => {return e})
  let validMail = usedMails.findIndex((e) => e[1].email == mailInput);
  let existingUser = usedMails[validMail]
  return editMailHandlerUpdate(existingUser, validMail, indexContact)
  }

  /**
   * Handler to sort different edit-contact cases, to prevent overwriting-typed bugs 
   * Cases explained here {@link initMailObj()}
   * @param {Boolean} existingUser 
   * @param {Number} validMail 
   * @param {Number} indexContact 
   * @returns - editMalHandler-Object
   */
 function editMailHandlerUpdate(existingUser, validMail, indexContact) {
  if (validMail == indexContact) { 
    editMailHandler.sameMailDBLookUp = true;
  } 
  if (!existingUser) {
    editMailHandler.addContact = true
    return editMailHandler 
  } else if (existingUser[1]?.canLogin === true || existingUser === undefined) {
    editMailHandler.hasUserAccount = true;
  } 
  else if (!existingUser[1]?.canLogin  && indexContact === undefined ) {
    editMailHandler.continueSubmit = true;
  } 
  return editMailHandler;
  }


/**
 * Handler to query if the active user is allowed to add,edit,delete tasks and contacts
 * @returns - it returns either true () or false, depending  on the filtered userIndex
 */
async function isValidUser() {
  let state = true;
  let userIndex = await user.validateUser();
  if (userIndex < 0) {
    showToastMessage("add-contact-reject-msg") 
    return  state = false
  };
    return state = true
}

/**
 * Handler to query if the signed in mail is already in use
 * It's called from {@link signupFormValidation()}
 * @returns - returns either true (mail is not in use) or false (mail is in use)
 */
async function validSignup() {
  let state = true
  let errorRef = document.getElementById(`email-error`);
  if (!await isMailUsable()) {
   errorRef.innerHTML = "Mail already exist. Please take an unused email";
    return
  } 
   if (!checkValidation()) {
    errorRef.innerHTML = "Please enter a valid, unused e-mail address";
    return  state = false
  }
  console.log(state);
  
  return state
}


/**
 * Function to trigger Password visible/unvisible for user
 *
 * @param {HTMLElement}  x the clicked Icon element
 */
function showPassword(x) {
  let password = x.previousElementSibling;
  if (password.type === "password" && password.value.length > 0) {
    password.type = "text";
    x.src = '/assets/icons/visibility_on.svg' 
  } else {
    password.type = "password";
    x.src = '/assets/icons/visibility_off.svg' 
  }
}
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
function signupFormValidation(event) {
  event.preventDefault();
  if (!regexValidation()) {
    return;
  }
  let userInput = document.getElementsByTagName("input");
  if (userInput[2].value.length < 8) {
    showErrorMessage("password-length", []);
  } else if (userInput[2].value !== userInput[3].value) {
    showErrorMessage("password", []);
  } else {
    getNewUserInformation();
  }
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

/**
 * Function to create JSON-object (signup - user credential), if checkMailRedundancy is false
 *
 */
function getNewUserInformation() {
  let userInput = document.getElementsByTagName("input");
  let userCredential = {};
  let key = "";
  let value = "";
  for (let index = 0; index < userInput.length; index++) {
    key = userInput[index].name;
    value = userInput[index].value;
    userCredential[key] = value;
  }
  checkMailRedundancy(userCredential);
}
  
/**
 * This function validates, if the mail during sign-up-process is already used in the database
 *
 * @param {object} credentials the sign-up credentials
 */
async function checkMailRedundancy(credentials) {

  let response = await fetch(database + "/user" + ".json");
  let responseRef = await response.json();
  let mails = getUsedMails(responseRef);
  if (responseRef === null) {
    postJSON("user", credentials);
    showMessage(credentials);
    return;
  }
  if (!mails.includes(credentials.email)) {
    postJSON("user", credentials);
    showMessage(credentials);
    return;
  }
  showErrorMessage("email-redundancy", []);
}

/**
 * This function gets all current used mails as an Array
 *
 * @param {*} responseRef all current users in the database
 * @returns Array with all already in use emails
 */
function getUsedMails(responseRef) {
  if (responseRef === null) {
    return "";
  }
  let mailValue = Object.values(responseRef);
  let usedMails = mailValue.map((i) => {
    return i.email;
  });
  return usedMails;
}

/**
 * This Function gives the User feedback, if signup was successful.
 * Also triggers to add a new contact
 *
 * @param {object} credentials object to
 */
function showMessage(credentials) {
  addNewContactOnSignup(credentials);
  let messageBox = document.querySelector(".signup-message");
  let blur = document.querySelector(".background-fade");
  let signup = document.querySelector(".login-container");
  messageBox.classList.remove("d-none");
  messageBox.classList.add("d-flex-row-c-c");
  blur.style.backgroundColor = "rgb(0, 0, 0, 0.10)";
  signup.classList.add('index-1')
  setTimeout(() => {
    location.href = "./login.html";
  }, 1800);
}

/**
 * This function creates a contact-object from users signup and posts it into /contacts-path
 *
 * @param {object} contactData dedicated information for contact-list
 */
function addNewContactOnSignup(contactData) {
  let contactObj = {};
  contactObj = {
    email: contactData.email,
    name: contactData.name,
    phone: "",
  };
  postJSON("contacts", contactObj);
}

/**
 * This function gets all users-credentials from database and triggers credential-check-function
 *
 * @param {string} path path of the database
 */
async function userLogin(path = "user") {
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
 * This function checks, if login-credentials are valid to credentials from database
 *
 * @param {object} responseRef all user credentials from the database
 */
async function checkLogInCredentials(responseRef) {
  if (responseRef == null) {
    showErrorMessage("user-existance", []);
    return;
  }
  let usersObj = Object.values(responseRef);
  let loginInput = document.getElementsByTagName("input");
  let name = filterUserName(usersObj, loginInput);
  let credentialsMerge = usersObj.map((i) => {
    return i.email + i.password;
  });
  if (credentialsMerge.includes(loginInput[0].value + loginInput[1].value)) {
    location.href = "html/summary.html";
    saveSession(name);
  } else {
    showErrorMessage("password", [...loginInput]);
  }
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
function saveSession(name) {
  setSessionStorage("user", name[0]);
  setSessionStorage(
    "initials",
    name[0]
      .split(" ")
      .map((i) => i[0]?.toUpperCase())
      .join("")
  );
}

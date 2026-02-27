let contactsArray = [];
let tasksArray = [];
let overlayTransitionMiliSeconds = 300;
let newContact = "newContact";
let emptyJSON = {};
let userArrayuserArray;
let idUser = sessionStorage.getItem("id")
let user = new User();


let contactColorClasses = [
  "bg-orange",
  "bg-purple",
  "bg-pink",
  "bg-darkpurple",
  "bg-turqoise",
  "bg-green",
  "bg-lightred",
  "bg-lightorange",
  "bg-lightpink",
  "bg-gold",
  "bg-royalblue",
  "bg-neon",
  "bg-yellow",
  "bg-red",
  "bg-sand",
];

/**
 * This function prevents event propagation.
 *
 * @param {Event} event - event object to stop event propagation
 */
function stopEventPropagation(event) {
  event.stopPropagation();
}


/**
 * This functions adds error-messages, based on the errors-id
 *
 * @param {Parameters} field declares the specific error id
 * @param {Array} array fields to iterate, if available
 */
function showErrorMessage(field, array) {
  let errorRef = document.getElementById(`${field}-error`);
  errorRef.classList.remove("opacity-0");
  array?.forEach((input) => {
    input.parentElement.classList.add("error-border");
  });
  errorRef.previousElementSibling.classList.add("error-border");
}

/**
 * Function to send JSON to firebase-server
 *
 * @param {*} path storage path on firebase-server
 * @param {JSON} data any object as JSON for database
 */
async function postJSON(path = "", data = {}) {
  let response = await fetch(database + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * This Function sets a sessionStorage
 *
 * @param {*} key key name for the session storage
 * @param {*} value value for the session storage
 */
function setSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

/**
 * Function to get database element from firebase server as JSON
 *
 * @param {string} path
 * @returns - database element as JSON
 */
async function getDataBaseElement(path = "") {
  let response = await fetch(database + path + ".json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let responseJSON = await response.json();
  return responseJSON;
}

/**
 * This function sends an object to the dedicated path
 *
 * @param {*} path the path of the firebase
 * @param {Object} object the object according to the path
 */
async function submitObjectToDatabase(path = "", object = {}) {
  let response = await fetch(database + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
}

/**
 * This function updates an entry from the firebase
 *
 * @param {*} path the path of the firebase
 * @param {*} object the object according to the path
 */
async function updateDatabaseObject(path = "", object = {}) {
  let response = await fetch(database + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
    
  });
}

/**
 * This function updates an entry from the firebase
 *
 * @param {*} path the path of the firebase
 * @param {*} object the object according to the path
 */
async function patchDatabaseObject(path = "", object = {}) {
  let response = await fetch(database + path + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
    
  });
}


/**
 * This function delets an element form firebase server and collects the response as JSON
 *
 * @param {string} path
 * @returns database element as JSON
 */
async function deleteDataBaseElement(path = "") {
  let response = await fetch(database + path + ".json", {
    method: "DELETE",
  });
  let responseJSON = await response.json();
  return responseJSON;
}

/**
 * This function sets the initials from the according contact based on the firebase entry
 *
 * @param {*} contactID contact ID from the firebase
 * @returns Initials
 */
function getFirstTwoStringInitialsByFirebaseId(contactID) {
  let stringInitials = "";
  for (let elementID of contactsArray) {
    if (contactID === elementID[0]) {
      let inputStringSplit = elementID[1].name.split(" ");
      if (inputStringSplit.length == 1) {
        stringInitials = inputStringSplit[0].charAt(0).toUpperCase();
      } else {
        stringInitials =
          inputStringSplit[0].charAt(0).toUpperCase() +
          inputStringSplit[1].charAt(0).toUpperCase();
      }
    }
  }
  return stringInitials;
}

/**
 * This function clears the Input Tag
 *
 * @param {*} htmlId the ID from the Input Tag
 */
function clearInputTagValue(htmlId) {
  let inputRef = document.getElementById(htmlId);
  inputRef.value = "";
}

/**
 * This function gets the value form the Input Tag
 *
 * @param {*} htmlId the ID from the Input Tag
 * @returns value from the according ID
 */
function getInputTagValue(htmlId) {
  if (document.getElementById(htmlId)) {
    console.log(document.getElementById(htmlId));
    
    return document.getElementById(htmlId).value;
  }
}
/**
 * Sets the value of an input html field
 *
 * @param {HTMLElement} htmlId
 * @param {*} valueToSet
 */
function setInputTagValue(htmlId, valueToSet) {
  let inputRef = document.getElementById(htmlId);
  inputRef.value = valueToSet;
}

/**
 * This function activates the toast message for user feedback
 *
 * @param {*} htmlId the ID from the according message-box
 */
function showToastMessage(htmlId) {
  document.body.style.overflow = "hidden";
  document.getElementById(htmlId).classList.add("d-block");
  setTimeout(() => {
    msgRef = document.getElementById(htmlId);
    msgRef.classList.remove("show");
    void msgRef.offsetWidth;
    msgRef.classList.add("show");
  }, 10);
  setTimeout(() => {
    document.body.style.overflow = "auto";
    document.getElementById(htmlId).classList.remove("d-none");
  }, 500);
}

/**
 * This function forwards the user to the Board
 *
 */
function directToBoardPage() {
  location.href = "board.html";
}


/**
 * Blurs background of the main screen.
 *
 */
function blurBackground() {
  document.getElementById("bg-dimmed").classList.add("dim-active");
}

/**
 * Checks whether first characters of two strings are equal
 *
 * @param {string} char1 - first character
 * @param {string} char2 - second character
 * @returns {boolean} true if first letters are equal
 */
function firstLettersAreEqual(char1, char2) {
  if (char1.charAt(0).toLowerCase() == char2.charAt(0).toLowerCase()) {
    return true;
  }
  return false;
}

/**
 * Returns current date.
 * @returns current day in format YYYYMMDD
 */
function getCurrentDateYYYMMDD() {
  let today = new Date();
  let year = String(today.getFullYear());
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

/**
 * Function to reset error-messages on login & signup page
 *
 */
function resetErrorMessage() {
  let error = document.getElementsByTagName("input");
  let message = document.getElementsByClassName("validation");
  [...error].forEach((element) => {
    element.parentElement.classList.remove("error-border");
  });
  [...message].forEach((message) => {
    message.classList.add("opacity-0");
  });
}

/**
 * Handler to identify, if all required fields match the regex-patterns
 * @returns either true (all required fields are valid) or false (at least 1 required field is invalid)
 */
function checkValidation() {
  let toValidate = document.querySelectorAll(".validate");
  let error = document.querySelectorAll(".validation");
  let valid;
  [...toValidate].every((e,i) => {
      valid = e.checkValidity();
      valid ? error[i].classList.add("opacity-0") : error[i].classList.remove("opacity-0");
     return valid;
  });
 return valid;
}

/**
 * This Function adds z-index-1 - class to current clicked element
 * It removes all current set z-index-1. classes
 *
 * @param {ThisType} dropdown - the clicked element
 */
function setZIndex(dropdown) {
  hasIndex = dropdown.classList.value.includes("z-index-1");
  hasIndizes = document.querySelectorAll(".z-index-1");
  hasIndizes.forEach((i) => {
    i.classList.remove("z-index-1");
  });
  dropdown.classList.add("z-index-1");
}

/**
 * This Function sends a signal to a webhook, to initiate n8n-workflow
 * @param {Event} e - the according Event
 */
function sendMail(e) {
  e.preventDefault();
  let form = new FormData(e.target);
  for (const [key, values] of form) {
    emptyJSON[key] = values;
  }
  
 if (!checkValidation()) {
  return
 }

  fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emptyJSON)
  })
  .then(response => {
    console.log(response);
    console.log(response.ok);
    
    if (response.ok) {
      showMessageBox("success");
      
    } else {
      showMessageBox("error");
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
    showMessageBox("error");
  })
  .finally(() => {
    resetInputs();
    hideMessageBox()
  })
}

/**
 * Resets all required fields 
 */
function resetInputs() {
  let requiredFields = document.querySelectorAll('[required]');
  [...requiredFields].forEach(e => { 
   e.value = ""
  });
}

/**
 * Handler to trigger according mail-information, depending on the fetch-result {@link sendMail() } 
 * @param {String} type 
 */
function showMessageBox(type) {
  let gridRef =  document.getElementById('login-view');
  type == "error" ?  gridRef.innerHTML += messageError() : gridRef.innerHTML += messageSuccess() 
}

/**
 * Handler to remove Message Box, after call
 * It's called after 2000 miliseconds
 */
function hideMessageBox() {
    setTimeout(() => {
    let messageRef = document.querySelectorAll(".message");
    [...messageRef][0].outerHTML = ""
  }, 2000);
}
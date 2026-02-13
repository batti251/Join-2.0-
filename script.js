let contactsArray = [];
let tasksArray = [];
let overlayTransitionMiliSeconds = 300;
let newContact = "newContact";
let emptyJSON = {};

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
 * This function checks Mail and Phone Validation according to set regex
 *
 * @returns Boolean value that determines whether the code block is executed or skipped
 */
function regexValidation() {
  const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const regexPhone = /^\+?\d{8,}$/;
  let mail = document.querySelectorAll("input");
  let filteredMail = [...mail].filter((t) => t.type == "email");
  let filteredPhone = [...mail].filter((t) => t.type == "tel");
  if (!regexMail.test(filteredMail[0].value)) {
    showErrorMessage("email", []);
    return false;
  }
  if (filteredPhone[0]?.value && !regexPhone.test(filteredPhone[0].value)) {
    showErrorMessage("phone", []);
    return false;
  } else return true;
}

/**
 * This functions adds error-messages, based on the errors-id
 *
 * @param {Parameters} field declares the specific error id
 * @param {Array} array fields to iterate, if available
 */
function showErrorMessage(field, array) {
  let errorRef = document.getElementById(`${field}-error`);
  errorRef.classList.remove("d-none");
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
  return document.getElementById(htmlId).value;
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
 * This Function replaces HTML5 Validation
 *  *
 * @param {String} taskStatusId parameter for addNewTask-case
 * @param {String} indexTask parameter for editTask-case
 * @param {String} newContact parameter for addNewContact-case
 * @param {String} indexContact parameter for editContact-case
 */
function requiredInputValidation(
  taskStatusId,
  indexTask,
  newContact,
  indexContact,
  subtask,
) {
  let requiredFields = document.getElementsByClassName("required");
  let validationMessageRef = document.getElementsByClassName("validation");
  let whitespacePattern = /^[ \t]*$/;
  let validationTrue = [...requiredFields].every(
    (element) => element.value != "" && !whitespacePattern.test(element.value),
  );
  if (validationTrue) {
    setAddOrEditSubmit(taskStatusId, indexTask, newContact, indexContact);
  } else {
    [...requiredFields].forEach((element, i) => {
      if (element.value === "" || whitespacePattern.test(element.value)) {
        validationMessageRef[i].classList.remove("d-none");
      } else {
        validationMessageRef[i].classList.add("d-none");
      }
    });
  }
}

/**
 * This Function wether submits a new task, or an editTask, depending on the tasks paramater
 *
 * @param {String} taskStatusId parameter for addNewTask-case
 * @param {String} indexTask parameter for editTask-case
 * @param {String} newContact parameter for addNewContact-case
 * @param {String} indexContact parameter for editContact-case
 */
function setAddOrEditSubmit(taskStatusId, indexTask, newContact, indexContact) {
  if (taskStatusId) {
    addNewTask(taskStatusId);
  } else if (indexTask >= 0) {
    submitEditTask(indexTask);
  } else if (newContact) {
    addNewContact();
  } else if (indexContact >= 0) {
    updateContact(indexContact);
  }
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
 * Toggle an arbitrary value from an array
 *
 * @param {*} value arbitrary value
 * @param {*} array array
 */
function toggleValueFromArray(value, array) {
  let index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
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
    message.classList.add("d-none");
  });
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

function sendMail(e) {
  e.preventDefault();
  let form = new FormData(e.target);
  
  for (const [key, values] of form) {
    emptyJSON[key] = values;
  }
  console.log(emptyJSON);

  fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emptyJSON)
  })
  .then(response => response.text())
  .then(result => {
    console.log("Mail sent:", result);
    alert("Mail wurde gesendet ✅");
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Fehler beim Senden ❌");
  });

  resetInputs()

}

function resetInputs() {
  let requiredFields = document.querySelectorAll('[required]');
  [...requiredFields].forEach(e => { 
   e.value = ""
  });
}

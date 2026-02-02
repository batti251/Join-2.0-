/**
 * Adds new task to firebase server and directs user to board page
 *
 * @param {string} newTaskStatusId task status id
 */
async function addNewTask(newTaskStatusId) {
  let newTaskScalarData = getNewTaskScalarInformation(newTaskStatusId);
  await submitObjectToDatabase("tasks", newTaskScalarData);
  tasksArray = await getTasksArray();
  await submitNewTaskOptionalComplexInfo();
  clearAddTaskForm();
  showToastMessage("add-task-toast-msg");
  setTimeout(() => {
    directToBoardPage();
  }, 2000);
}

/**
 * Submits a new task's optional complex information to firebase server
 *
 * @param {string} editID
 */
async function submitNewTaskOptionalComplexInfo(editID) {
  let newTaskFirebaseId = "";
  if (editID) {
    newTaskFirebaseId = editID;
  } else {
    newTaskFirebaseId = tasksArray[tasksArray.length - 1][0];
  }
  await submitNewTaskAssignedContacts(newTaskFirebaseId);
  await submitNewTaskSubtasks(newTaskFirebaseId);
}

/**
 * Submits a new task's assigned contacts to firebase server
 *
 * @param {string} newTaskFireBaseId task firebase id
 */
async function submitNewTaskAssignedContacts(newTaskFireBaseId) {
  let path = "tasks/" + String(newTaskFireBaseId) + "/assignedTo";
  await deleteDataBaseElement(path);
  for (let contactID of newTaskAssignedContactsIndices) {
    let assignedContactEntry = contactsArray.find(
      (entry) => entry[0] === contactID
    );
    if (assignedContactEntry) {
      let keyValuePairs = {
        Id: contactID,
        name: assignedContactEntry[1].name,
      };
      await submitObjectToDatabase(path, keyValuePairs);
    }
  }
}

/**
 * Sets a subtask's status
 *
 * @param {htmlElement} currentElement
 * @param {integer} indexTask
 * @param {string} subtaskID
 */
async function setSubtaskStatus(currentElement, indexTask, subtaskID) {
  let path = tasksArray[indexTask][0];
  obj = currentElement.checked;
  await updateDatabaseObject(`tasks/${path}/subtasks/${subtaskID}/done`, obj);
  await initBoard();
}

/**
 * Submits a new task's subtask
 *
 * @param {string} newTaskFirebaseId
 */
async function submitNewTaskSubtasks(newTaskFirebaseId) {
  let path = "tasks/" + String(newTaskFirebaseId) + "/subtasks";
  await deleteDataBaseElement(path);
  for (let i = 0; i < newTaskSubtasks.length; i++) {
    let keyValuePairs = {};
    keyValuePairs.name = newTaskSubtasks[i].name;
    keyValuePairs.done = newTaskSubtasks[i].done;
    await submitObjectToDatabase(path, keyValuePairs);
  }
}

/**
 * Adds a subtask to add task form
 */
function addSubtask() {
  if (subtaskValidation()) {
    return;
  } else {
    normalizeSubtasksArray();
    const subtaskName = getInputTagValue("task-subtasks");
    newTaskSubtasks.push({ name: subtaskName, done: false });
    renderSubtasks();
    clearInputTagValue("task-subtasks");
    resetSubtaskcontrolButtons();
    showSubtaskControlButtons();
  }
}

/**
 * This Function validates subtask Input Pattern. Only whitespaces are note allowed
 *
 * @returns true or false according to if-statement
 *          true = Input is validated according to Pattern
 *          false = Input is not validated according to Pattern
 */
function subtaskValidation() {
  let subtaskInput = document.getElementById("task-subtasks");
  let whitespacePattern = /^[ \t]*$/;
  if (subtaskInput.value != "" && !whitespacePattern.test(subtaskInput.value)) {
    return false;
  } else return true;
}

/**
 * Edits a subtask
 *
 * @param {integer} indexSubtask
 */
function editSubtask(indexSubtask) {
  let editedSubtaskRef = document.getElementById(
    "task-subtask-" + indexSubtask
  );
  editedSubtaskRef.innerHTML = getEditSubtaskTemplate(indexSubtask);
}

/**
 * Adds a new subtask to add task input form
 *
 * @param {integer} indexSubtask
 */
function addEditedSubtask(indexSubtask) {
  let inputRef = "task-subtask-edit-" + String(indexSubtask);
  editedSubtaskName = getInputTagValue(inputRef);
  newTaskSubtasks[indexSubtask].name = editedSubtaskName;
  renderSubtasks();
}

/**
 * Deletes a subtask from add task form
 *
 * @param {integer} indexSubtask
 */
function deleteSubtask(indexSubtask) {
  newTaskSubtasks.splice(indexSubtask, 1);
  renderSubtasks();
}

/**
 * Searches a contact to assign via contact's name
 */
function searchContact() {
  let searchKey = document
    .getElementById("task-assigned-contacts")
    .value.toLowerCase();
  let foundRefs = "";
  let contactsRefs = Array.from(
    document.getElementsByClassName("task-assigned-contact-wrap")
  );
  for (let i = 0; i < contactsRefs.length; i++) {
    contactsRefs[i].style.display = "none";
  }
  foundRefs = contactsRefs.filter((htmlElement) =>
    htmlElement.innerText.toLowerCase().includes(searchKey)
  );
  for (let i = 0; i < foundRefs.length; i++) {
    foundRefs[i].style.display = "";
  }
}

/**
 * Submits a new subtask to add task form if user presses enter key
 *
 * @param {event} event
 */
function addSubtaskOnEnterPress(event) {
  if (event.key === "Enter") {
    addSubtask();
    event.preventDefault();
  }
}

/**
 * Removes firebase id from subtasks array pulled from firebase server.
 */
function normalizeSubtasksArray() {
  for (let i = 0; i < newTaskSubtasks.length; i++) {
    if (Array.isArray(newTaskSubtasks[i])) {
      const data = newTaskSubtasks[i][1];
      const obj = {
        name: data.name,
        done: data.done,
      };
      newTaskSubtasks[i] = obj;
    }
  }
  subtasksNormalized = true;
}

/**
 * Gets new task scalar information from input fields
 *
 * @param {string} newTaskStatusId
 * @param {object} editedTaskObj
 * @returns
 */
function getNewTaskScalarInformation(newTaskStatusId, editedTaskObj) {
  if (editedTaskObj) {
    insertMandatoryTaskInfo(editedTaskObj);
    insertOptionalScalarTaskInfo(editedTaskObj);
    return editedTaskObj;
  } else {
    let newTaskScalarInfo = {};
    insertMandatoryTaskInfo(newTaskScalarInfo, newTaskStatusId);
    insertOptionalScalarTaskInfo(newTaskScalarInfo);
    return newTaskScalarInfo;
  }
}

/**
 *
 * @param {object} newTaskObj
 * @param {string} newTaskStatusId
 */
function insertMandatoryTaskInfo(newTaskObj, newTaskStatusId) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.priority = newTaskPriority;
  if (newTaskStatusId) {
    newTaskObj.category = getTaskCategoryFirebaseName();
    newTaskObj.status = newTaskStatusId;
  }
}

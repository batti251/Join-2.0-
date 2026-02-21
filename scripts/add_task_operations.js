let obj = new Task();

/**
 * Adds new task to firebase server and directs user to board page
 *
 */
async function addNewTask() {
  let userIndex = await obj.validateUser();
  if (userIndex < 0) {
    showToastMessage("add-task-reject-msg") 
    return};
  obj.buildNewTask("form-add-task");
  await submitObjectToDatabase("tasks", obj);
  tasksArray = await getTasksArray();
  clearAddTaskForm();
  closeAddTaskDialog();
}

/**
 * This function shows toast-message after successfull task add
 * It directs to the board, after a 2second timeout
 */
function closeAddTaskDialog() {
  showToastMessage("add-task-toast-msg");
  setTimeout(() => {
    directToBoardPage();
  }, 2000);
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
    document.getElementsByClassName("task-assigned-contact-wrap"),
  );
  for (let i = 0; i < contactsRefs.length; i++) {
    contactsRefs[i].style.display = "none";
  }
  foundRefs = contactsRefs.filter((htmlElement) =>
    htmlElement.innerText.toLowerCase().includes(searchKey),
  );
  for (let i = 0; i < foundRefs.length; i++) {
    foundRefs[i].style.display = "";
  }
}

/**
 * This Function submits the edited Task to the firebase and reloads the board
 *
 * @param {String} indexTask index of the task
 */
async function submitEditTask(indexTask) {
  let editedTaskObj = tasksArray[indexTask][1];
  let taskID = tasksArray[indexTask][0];
  let userIndex = await obj.validateUser();
  event.preventDefault();
  if (userIndex < 0) {
    showToastMessage("edit-task-reject-msg");
    return};
  obj.buildNewTask("form-edit-task", editedTaskObj);
  await patchDatabaseObject(`tasks/${taskID}`, obj);
  tasksArray = await getTasksArray();
  await initBoard();
  closeEditTaskDialog();
}

/**
 * This function shows toast-message after successfull user edit
 */
function closeEditTaskDialog() {
  let overlay = document.querySelector(".task-overlay-wrap");
  showToastMessage("add-task-toast-msg");
  closeTaskOverlays();
  setTimeout(() => {
    overlay.innerHTML = "";
  }, 500);
}

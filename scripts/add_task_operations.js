  let obj = new Task()

/**
 * Adds new task to firebase server and directs user to board page
 *
 */
async function addNewTask() {
let x = await obj.validateUser()
if (x < 0) {console.log("false") 
  return};
  obj.newAddTask()
   await submitObjectToDatabase("tasks", obj);
  tasksArray = await getTasksArray();
  clearAddTaskForm();
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






// EDIT TASK refactoring!
/**
 * Gets new task scalar information from input fields
 *
 * @param {string} newTaskStatusId
 * @param {object} editedTaskObj
 * @returns
 */
function getNewTaskScalarInformation(newTaskStatusId, editedTaskObj) {
    console.log("NÖTIG");
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

// EDIT TASK refactoring!
/**
 *
 * @param {object} newTaskObj
 * @param {string} newTaskStatusId
 */
function insertMandatoryTaskInfo(newTaskObj, newTaskStatusId) {
  console.log("NÖTIG");
  
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.priority = newTaskPriority;
  newTaskObj.source = "human";
  let userID = sessionStorage.getItem("id");
  let userObj = contactsArray.find(e => e[0] == userID);
  newTaskObj.creator = userObj[1].name;
  newTaskObj.creatorId = sessionStorage.getItem("id")
  if (newTaskStatusId) {
    newTaskObj.category = getTaskCategoryFirebaseName();
    newTaskObj.status = newTaskStatusId;
  }
}

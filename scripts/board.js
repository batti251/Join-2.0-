let currentTask = "";
let suppressClick = false;
/**
 * Initializes board page. Initializes contacts and task arrays and renders board columns.
 */
async function initBoard() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  await renderBoard();
}

/**
 * Renders the Board for each task status column
 *
 */
async function renderBoard() {
  renderBoardColumn("triage", "triage");
  renderBoardColumn("to-do", "todo");
  renderBoardColumn("in-progress", "inprogress");
  renderBoardColumn("await-feedback", "awaitfeedback");
  renderBoardColumn("done", "done");
}

/**
 * Renders a Board Column
 *
 * @param {String} columHTMLid task status from the DOM
 * @param {String} taskStatusId status from the firebase
 */
function renderBoardColumn(columHTMLid, taskStatusId) {
  let boardColRef = document.getElementById(columHTMLid);
  boardColRef.innerHTML = "";
  for (let i = 0; i < tasksArray.length; i++) {
    if (!taskHasStatus(taskStatusId, i)) {
      continue;
    }
    boardColRef.innerHTML += getBoardCardTemplate(i);
    if (subtasksExist(i)) {
      renderSubtaskProgressInfo(i);
    }
    renderBoardCardContacts(i);
  }
  checkEmptyColumn(columHTMLid);
}

/**
 * Renders a placeholder if no tasks were found in the dedicated column
 *
 * @param {String} columHTMLid task status from the DOM
 */
function checkEmptyColumn(columHTMLid) {
  let boardColRef = document.getElementById(columHTMLid);
  let titleRef =
    boardColRef.parentElement.getElementsByClassName("col-title-wrap");
  let title = [...titleRef].map((t) => t.innerText);
  let board = boardColRef.getElementsByClassName("task-card-wrap");
  if (board.length == 0) {
    boardColRef.innerHTML += getNoTask(title);
  }
}

/**
 * Checks whether a task has a certain task status
 *
 * @param {string} taskStatusId
 * @param {integer} indexTask
 * @returns {boolean} true if the task has the specified status, otherwise false
 */
function taskHasStatus(taskStatusId, indexTask) {
  return tasksArray[indexTask][1].status === taskStatusId;
}

/**
 * Checks whether a task has subtasks
 *
 * @param {integer} indexTask
 * @returns {boolean} true if task has subtasks, otherwise false
 */
function subtasksExist(indexTask) {
  return tasksArray[indexTask][1].subtasks !== undefined;
}

/**
 * This Function renders all subtasks info on dedicated tasks
 *
 * @param {String} indexTask index of tasks with subtasks
 */
function renderSubtaskProgressInfo(indexTask) {
  let htmlId = "subtasks-progress-" + String(indexTask);
  let taskSubtaskInfoRef = document.getElementById(htmlId);
  taskSubtaskInfoRef.innerHTML = "";
  taskSubtaskInfoRef.innerHTML = getTaskCardSubtaskTemplate(indexTask);
  renderSubtasksProgressbarFill(indexTask);
}

/**
 * This Function renders Tasks Contact with a lmit of maximum 3 badges, else indicated by a layer
 *
 * @param {String} indexTask index of tasks with subtasks
 */
function renderBoardCardContacts(indexTask) {
  let htmlId = "task-contacts-" + String(indexTask);
  let taskCardContactsRef = document.getElementById(htmlId);
  taskCardContactsRef.innerHTML = "";
  let objKeys = Object.keys(tasksArray[indexTask][1]?.assignedTo || {}).length;
  let maximalShownBadges = Math.min(3, objKeys);
  for (
    let indexTaskContact = 0;
    indexTaskContact < maximalShownBadges;
    indexTaskContact++
  ) {
    taskCardContactsRef.innerHTML += getTaskCardContactsTemplate(
      indexTaskContact,
      indexTask
    );
  }
  if (objKeys > maximalShownBadges) {
    taskCardContactsRef.innerHTML += getTaskAssignedContactsRemainderTemplate(
      objKeys - maximalShownBadges
    );
  }
}

/**
 * This Function toggles a user-feedback, if no searched task was found
 *
 * @param {Object} foundRef  the task element
 */
function setNoTaskFoundFeedback(foundRef) {
  let noTask = document.getElementById("no-task-found");
  if (foundRef.length == 0) {
    noTask.classList.remove("d-none");
  } else {
    noTask.classList.add("d-none");
  }
}

/**
 * Opens add task overlay
 *
 * @param {string} taskStatusId 
 */
function openAddTaskOverlay(taskStatusId) {
  let addTaskOverlayWrap = document.getElementById("add-task-overlay-wrap");
  let addTaskOverlayBGWrap = document.getElementById("add-task-overlay-bg-wrap");
    addTaskOverlayWrap.classList.remove("d-none");
    addTaskOverlayBGWrap.classList.add("disable-scroll");
    addTaskOverlayBGWrap.classList.add("dim-active");
  setTimeout(() => {
  renderAddTaskForm("add-task-overlay", taskStatusId);
    addTaskOverlayWrap.classList.add("overlay-open");
  }, overlayTransitionMiliSeconds);
}

/**
 * Closes add task overlay
 */
function closeAddTaskOverlay() {
  let addTaskOverlayWrap = document.getElementById("add-task-overlay-wrap");
  let taskOverlayWrap = document.getElementById("task-overlay-wrap");
  let addTaskOverlayBGWrap = document.getElementById("add-task-overlay-bg-wrap");
    addTaskOverlayWrap.classList.remove("overlay-open");
    addTaskOverlayBGWrap.classList.remove("dim-active");
    resetrequiredFields()
   renderBoard();
   setTimeout(() => {
    taskOverlayWrap.innerHTML = "";
    addTaskOverlayWrap.classList.add("d-none");
    addTaskOverlayBGWrap.classList.remove("disable-scroll")
  }, 200);
}

/**
 * This Function resets required Input Fields for Form Validation in addtask 
 * 
 */
function resetrequiredFields() {
  let requiredFields = document.getElementsByClassName("required");
  [...requiredFields].forEach((element) => element.className = "") 
}


function handleTaskClick(indexTask) {
  
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  showTaskOverlay(indexTask);
}



/**
 * This function sets the overlay from the current clicked task-element
 *
 * @param {String} indexTask  index of the task
 */
async function showTaskOverlay(indexTask) {
  let currentTask = tasksArray[indexTask][1];
  let taskOverlayWrap = document.getElementById("task-overlay-wrap");
  let taskOverlay = document.getElementById("task-overlay"); 
    taskOverlayWrap?.classList.remove("d-none");
    taskOverlay.classList.add("disable-scroll")
  blurBackgroundBoard();
  setTimeout(() => {
    getTaskOverlay(indexTask, currentTask, taskOverlayWrap);
    overlayWipe();
  }, overlayTransitionMiliSeconds);
}

/**
 * This Function removes the Task Overlay
 *
 */
function closeTaskOverlays() {
  let taskOverlayWrap = document.getElementById("task-overlay-wrap");
  let taskOverlay = document.getElementById("task-overlay");
  let addTaskOverlayWrap = document.getElementById("add-task-overlay-wrap");
    taskOverlayWrap.classList.remove("open");
   taskOverlay.classList.remove("dim-active");
    newTaskAssignedContactsIndices = [];
  renderBoard();
  setTimeout(() => {
    taskOverlayWrap.innerHTML = "";
    taskOverlayWrap.classList.add("d-none");
    addTaskOverlayWrap.classList.add("d-none");
    taskOverlay.classList.remove("disable-scroll")
  }, 200);
}

/**
 * Adds a darker background to get a better focus on current overlay
 *
 */
function blurBackgroundBoard() {
  document.getElementById("task-overlay").classList.add("dim-active");
}

/**
 * This Function shows the overlay element
 *
 */
function overlayWipe() {
  let taskOverlayRef = document.getElementById("task-overlay-wrap");
  taskOverlayRef.classList.add("open");
}

/**
 * Renders subtask progress bar progression fill
 *
 * @param {integer} indexTask
 */
function renderSubtasksProgressbarFill(indexTask) {
  let progBarRef = document.getElementById("progress-" + String(indexTask));
  let widthString =
    String(
      (
        getTaskCompletedSubtasksNumber(indexTask) /
        tasksArray[indexTask][1].subtasks.length
      ).toFixed(2) * 100
    ) + "%";
  progBarRef.style.width = widthString;
}

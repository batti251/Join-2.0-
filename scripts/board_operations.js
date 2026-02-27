/**
 * This Function sets backgroundclass based on tasks category class
 *
 * @param {String} current taskCategory class
 * @returns {String} new background class
 */
function getTaskCategoryClass(taskCategory) {
  let taskCategoryClass = "";
  switch (taskCategory) {
    case "user-story":
      taskCategoryClass = "bg-user-story";
      break;
    case "technical-task":
      taskCategoryClass = "bg-technical-task";
      break;
  }
  return taskCategoryClass;
}

/**
 * This function turns tasks status into the according status-svg
 *
 * @param {String} taskUrgency status of the tasks
 * @returns {String} svg-path according to status
 */
function getTaskPriorityIconSrc(taskUrgency) {
  let iconSrc = "";
  switch (taskUrgency) {
    case "urgent":
      iconSrc = "../assets/icons/urgent.svg";
      break;
    case "medium":
      iconSrc = "../assets/icons/medium.svg";
      break;
    case "low":
      iconSrc = "../assets/icons/low.svg";
      break;
  }
  return iconSrc;
}

/**
 * this Function turns task status into correct spelling
 *
 * @param {String} taskCategory task category: user-story / technical-task
 * @returns {String} correct spelled task Category
 */
function getCategoryNameTemplate(taskCategory) {
  switch (taskCategory) {
    case "user-story":
      return "User Story";
    case "technical-task":
      return "Technical Task";
  }
}

/**
 * This Function allows to search within the boards for title and description
 *
 */
function searchTask() {
  let taskWrap = document.getElementsByClassName("task-card-wrap");
  let inputRef = document.getElementsByClassName("search-input");
  let searchRef = document.getElementsByClassName("task-description-wrap");
  let foundRef = "";
  [...taskWrap].forEach((c) => c.classList.add("d-none"));
  foundRef = [...searchRef].filter((t) =>
    t.innerText.toLowerCase().includes(inputRef[0].value.toLowerCase()),
  );
  foundRef.forEach((c) =>
    c.parentElement.parentElement.classList.remove("d-none"),
  );
  setNoTaskFoundFeedback(foundRef);
}

/**
 * Calculates the completed subtasks of a task
 *
 * @param {integer} indexTask
 * @returns {integer} number of completed subtasks
 */
function getTaskCompletedSubtasksNumber(indexTask) {
  let completedSubtasksNumber = 0;
  for (
    let indexSubtask = 0;
    indexSubtask < tasksArray[indexTask][1].subtasks.length;
    indexSubtask++
  ) {
    if (tasksArray[indexTask][1].subtasks[indexSubtask][1].done == true) {
      completedSubtasksNumber += 1;
    }
  }
  return completedSubtasksNumber;
}

/**
 * This Function deletes the current active Task
 *
 * @param {String} indexTask  index of the task
 */
async function deleteTask(indexTask) {
  let userIndex = await obj.validateUser();
  if (userIndex < 0) {
    showToastMessage("delete-task-reject-msg") 
    return};
  closeTaskOverlays();
  await deleteDataBaseElement(`tasks/${tasksArray[indexTask][0]}`);
  await initBoard();
}

/**
 * This Function opens edit-Task Overlay and loads its specific content
 *
 * @param {String} indexTask index of the task
 */
async function editTask(indexTask) {
  tasksArray = await getTasksArray();
  let overlay = document.querySelector(".task-overlay-wrap");
  let currentTask = tasksArray[indexTask][1];
  loadOptionalScalarTaskInfo(currentTask, indexTask);
  overlay.innerHTML = editTaskTemplate(indexTask, currentTask);
  renderContactsBadges(newTaskAssignedContactsIndices);
}

/**
 * This Function sets the optional content from the to-edit-Task (assignedTo / subtasks)
 *
 * @param {Object} currentTask the current edited Task
 * @param {String} indexTask index of the task
 */
function loadOptionalScalarTaskInfo(currentTask, indexTask) {
  let currentSubtasks = tasksArray[indexTask][1]?.subtasks || {};
  newTaskAssignedContactsIndices =
    currentTask.assignedTo?.map((i) => i[1].Id) || [];
  newSubtasksIndices = currentTask.subtasks?.map((i) => i[1].Id) || [];
  newTaskSubtasks = Object.values(currentSubtasks).map((i) => i[1]);
}









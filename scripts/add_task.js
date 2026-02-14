let newTaskAssignedContactsIndices = [];
let newTaskSubtasks = [];
let newTaskPriority = "medium";
let currentDate = getCurrentDateYYYMMDD();

/**
 * Initializes the add task form
 */
async function addTaskInit() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  renderAddTaskForm("add-task-form-wrap", "triage");
  console.log(contactsArray);
  
}

/**
 * Renders add task form into html container
 *
 * @param {string} htmlId HTML Tag Id where task form shall be rendered
 * @param {string} taskStatusId Id of task status
 */
function renderAddTaskForm(htmlId, taskStatusId) {
  newTaskSubtasks = [];
  let ref = document.getElementById(htmlId);
  ref.innerHTML = "";
  ref.innerHTML = getAddTaskFormTemplate(taskStatusId);
}

/**
 * Clears the add task form
 */
function clearAddTaskForm() {
  clearInputTagValue("task-title");
  clearInputTagValue("task-description");
  clearInputTagValue("task-due-date");
  setTaskPriority("task-priority-medium");
  clearInputTagValue("task-assigned-contacts");
  clearInputTagValue("task-category");
  clearInputTagValue("task-subtasks");
  newTaskAssignedContactsIndices = [];
  renderContactsBadges(newTaskAssignedContactsIndices);
  newTaskSubtasks = [];
  renderSubtasks();
}

/**
 * Gets taks category firebase name
 *
 * @returns task category firebase name
 */
function getTaskCategoryFirebaseName() {
  let key = "";
  key = getInputTagValue("task-category");
  if (key.includes("Technical")) {
    return "technical-task";
  } else {
    return "user-story";
  }
}

/**
 * Inserts optional scalar task information into new Task object
 *
 * @param {object} newTaskObj
 */
function insertOptionalScalarTaskInfo(newTaskObj) {
  if (getInputTagValue("task-description") !== "") {
    newTaskObj.description = getInputTagValue("task-description");
  }
}

/**
 * Sets new task priority button
 *
 * @param {string} htmlId
 */
function setTaskPriority(htmlId) {
  resetAllPriorityBtns();
  let activeBtn = document.getElementById(htmlId);
  switch (htmlId) {
    case "task-priority-urgent":
      activeBtn.classList.add("active-urgent");
      newTaskPriority = "urgent";
      break;
    case "task-priority-low":
      activeBtn.classList.add("active-low");
      newTaskPriority = "low";
      break;
    default:
      activeBtn.classList.add("active-medium");
      newTaskPriority = "medium";
      break;
  }
}

/**
 * Resets all priority buttons to inactive
 */
function resetAllPriorityBtns() {
  let buttons = document.getElementsByClassName("btn-priority");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active-urgent", "active-medium", "active-low");
  }
}

/**
 * Opens Task Category Dropdown
 */
function openTaskCategoryDropdown() {
  let categoryDropdownRef;
  let categoryDropdownIconRef;
  categoryDropdownRef = document.getElementById("task-category-dropdown");
  categoryDropdownIconRef = document.getElementById(
    "task-category-dropdown-icon"
  );
  clearInputTagValue("task-category");
  categoryDropdownRef.classList.remove("d-none");
  categoryDropdownIconRef.classList.add("task-dropdown-open-icon");
}

/**
 * Closes Task Category Dropdown
 */
function closeTaskCategoryDropdown() {
  let categoryDropdownRef = document.getElementById("task-category-dropdown");
  let categoryDropdownIconRef = document.getElementById(
    "task-category-dropdown-icon"
  );
  categoryDropdownRef.classList.add("d-none");
  categoryDropdownIconRef.classList.remove("task-dropdown-open-icon");
}

/**
 * Shows a subtask's control buttons (sumit and clear)
 */
function showSubtaskControlButtons() {
  let subtaskInputValueLength;
  let addIconRef;
  let controlIconsWrapRef;
  subtaskInputValueLength =
    document.getElementById("task-subtasks").value.length;
  addIconRef = document.getElementById("task-add-subtask-icon");
  controlIconsWrapRef = document.getElementById(
    "task-clear-submit-subtask-icon-wrap"
  );
  addIconRef.classList.add("d-none");
  controlIconsWrapRef.classList.remove("d-none");
}

/**
 * Resets subtask control buttons
 */
function resetSubtaskcontrolButtons() {
  let addIconRef;
  let controlIconsWrapRef;
  if (addIconRef) {
    addIconRef.classList.remove("d-none");
    controlIconsWrapRef.classList.add("d-none");
  } else return;
}

/**
 * Renders a task's subtasks
 */
function renderSubtasks() {
  let subtaskListRef;
  subtaskListRef = document.getElementById("tasks-subtasks-list");
  subtaskListRef.innerHTML = "";
  for (
    let indexSubtask = 0;
    indexSubtask < newTaskSubtasks.length;
    indexSubtask++
  ) {
    subtaskListRef.innerHTML += getSubtaskListTemplate(indexSubtask);
  }
}

/**
 * Toggles task assigned contacts dropdown menu
 */
function toggleTaskAssignedContactsDropdown() {
  let assignedContactsDropdownRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsDropdownRef.classList.toggle("d-none");
  assignedContactsDropdownRef.classList.toggle("d-flex-column");
  toggleTaskAssignedContactsDropdownIcon();
  toggleTaskAssignedContactsBadges();
  renderTaskAssigendContacts();
  renderContactCheckboxes(newTaskAssignedContactsIndices);
  renderContactsBadges(newTaskAssignedContactsIndices);
}

/**
 * Toggles the icon of task assigned contacts dropdown menu
 */
function toggleTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.toggle("task-dropdown-open-icon");
}

/**
 * Toggles the badges task assigned contacts
 */
function toggleTaskAssignedContactsBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.toggle("d-none");
}

/**
 * Opens taks assigned contacts dropdown menu
 */
function openTaskAssignedContactsDropdown() {
  let assignedContactsDropdownRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsDropdownRef.classList.remove("d-none");
  assignedContactsDropdownRef.classList.add("d-flex-column");
  openTaskAssignedContactsDropdownIcon();
  openTaskAssignedContactsDropdownBadges();
  renderTaskAssigendContacts();
  renderContactCheckboxes(newTaskAssignedContactsIndices);
  renderContactsBadges(newTaskAssignedContactsIndices);
  searchContact();
}

/**
 * Opens task assigned contacts dropdown icon
 */
function openTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.add("task-dropdown-open-icon");
}

/**
 * Shows badges of task assigned contacts
 */
function openTaskAssignedContactsDropdownBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.add("d-none");
}

/**
 * Closes task assigned contacts dropdown menu
 */
function closeTaskAssignedContactsDropdown() {
  let assignedContactsDropdownRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  if (assignedContactsDropdownRef === null) return;
  assignedContactsDropdownRef.classList.add("d-none");
  assignedContactsDropdownRef.classList.remove("d-flex-column");
  closeTaskAssignedContactsDropdownIcon();
  closeTaskAssignedContactsDropdownBadges();
  renderTaskAssigendContacts();
  renderContactCheckboxes(newTaskAssignedContactsIndices);
  renderContactsBadges(newTaskAssignedContactsIndices);
  clearInputTagValue("task-assigned-contacts");
}

/**
 * Hides task assigned contacts dropdown icon
 */
function closeTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.remove("task-dropdown-open-icon");
}

/**
 * Hides task assigned contacts badges
 */
function closeTaskAssignedContactsDropdownBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.remove("d-none");
}

/**
 * Renders contact Badges
 * @param {array} array
 */
function renderContactsBadges(array) {
  let badgesRef;
  badgesRef = document.getElementById("task-assigned-contacts-badges");
  badgesRef.innerHTML = "";
  let maximalShownBadges = Math.min(3, array.length);
  for (let i = 0; i < maximalShownBadges; i++) {
    badgesRef.innerHTML += getTaskAssignedContactBadgeTemplate(array[i], i);
  }
  if (array.length > maximalShownBadges) {
    badgesRef.innerHTML += getTaskAssignedContactsRemainderTemplate(
      array.length - maximalShownBadges
    );
  }
}

/**
 * Toggle assignment of a contact
 *
 * @param {string} contactID
 * @param {htmlElement} htmlElement
 */
function toggleAssignContact(contactID, htmlElement) {
  htmlElement.classList.toggle("focus");
  toggleValueFromArray(contactID, newTaskAssignedContactsIndices);
  renderContactsBadges(newTaskAssignedContactsIndices);
}

/**
 * Renders a taks assigned contacts
 */
function renderTaskAssigendContacts() {
  let assignedContactsRef = "";
  assignedContactsRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsRef.innerHTML = "";
  for (
    let indexContact = 0;
    indexContact < contactsArray.length;
    indexContact++
  ) {
    assignedContactsRef.innerHTML += getTaskAssigendContactsTemplate(
      contactsArray[indexContact][0],
      indexContact
    );
  }
}

/**
 * Renders checkboxes of assigned contacts in add task form
 *
 * @param {array} array
 */
function renderContactCheckboxes(array) {
  for (let indexContact = 0; indexContact < array.length; indexContact++) {
    let indexAssignedContact = array[indexContact];
    assignedContactWrapRef = document.getElementById(
      "task-assigned-contact-wrap-" + indexAssignedContact
    );
    assignedContactWrapRef.classList.add("focus");
  }
}

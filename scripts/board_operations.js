/**
 * Pulls task data from firebase server and put them into an array
 *
 * @returns array with all tasks from firebase server
 */
async function getTasksArray() {
  tasksArray = [];
  let tasks = await getDataBaseElement("tasks");
  if (tasks == null) {
    return tasksArray;
  }
  tasksArray = Object.entries(tasks).map(([taskId, taskData]) => {
    if (taskData.assignedTo !== undefined) {
      taskData.assignedTo = Object.entries(taskData.assignedTo);
    }
    if (taskData.subtasks !== undefined) {
      taskData.subtasks = Object.entries(taskData.subtasks);
    }
    return [taskId, taskData];
  });
  return tasksArray;
}

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

async function moveTaskToColumn(column) {
  console.log(column);

  if (!column || !currentTask) return;

  const targetStatus = column.id.replace("-", "");
  await updateDatabaseObject(`tasks/${currentTask[0]}/status`, targetStatus);
  await initBoard();
}

const dragState = {
  element: null,
  taskIndex: null,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  initialRect: null,
  isDragging: false,
  hasPointerCapture: false,
  longPressTimer: null,
};

const dragConfig = {
  longPressDelay: 100,
  autoScrollEdge: 80,
  autoScrollSpeed: 12,
};

const scrollState = {
  container: document.getElementById("main"),
  direction: 0,
  rafId: null,
};

/**
 * Triggers Drag and Drop Functionality
 * Initiates the EventListeners for Moving and Drop
 * @param {PointerEvent} event - the active pointer move Event
 * @param {Number} taskIndex - index of the pointed down task
 */
async function pointerDown(event, taskIndex) {
  dragStateInitiate(event, taskIndex);
  document.addEventListener("pointermove", pointerMove);
  document.addEventListener("pointerup", pointerUp);
}

/**
 * Sets dragStates-settings to initiated Pointer Event
 * Starts the Drag-Event, when longPress-timer was reached => better handling for click-event
 * @param {PointerEvent} event - the active pointer move Event
 * @param {Number} taskIndex - index of the pointed down task
 */
function dragStateInitiate(event, taskIndex) {
  dragState.element = event.currentTarget;
  dragState.taskIndex = taskIndex;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.isDragging = false;
  dragState.sourceColumn = event.currentTarget.closest(".col-content");
  dragState.longPressTimer = setTimeout(
    () => startDrag(event),
    dragConfig.longPressDelay,
  );
}

/**
 *
 * @param {PointerEvent} event - the active pointer move Event
 */
async function startDrag(event) {
  if (dragState.isDragging) return;
  setPointerCapture(event);
  changeDragStateStart(dragState.element, event);
  tasksArray = await getTasksArray();
  currentTask = tasksArray[dragState.taskIndex];
  toggleDragArea();
  assignDragStateObject(dragState.element);
  dragState.element.classList.add("dragging");
}

/**
 * Sets the dragged Element as capture target
 * @param {PointerEvent} event - the active pointer move Event
 */
function setPointerCapture(event) {
  dragState.element.setPointerCapture?.(event.pointerId);
}

/**
 * Sets the dragged Element to the necessary states to move it properly
 *
 * @param {Object} el - the current dragged Element
 * @param {PointerEvent} event - the active pointer move Event
 */
function changeDragStateStart(el, event) {
  dragState.isDragging = true;
  dragState.hasPointerCapture = true;
  adjustDraggedElementRect(el, event);
}

/**
 * Sets the Size of the dragged Element and let it move with the touch/mouse-event
 * Recalculate the offsets to avoid elements shifting
 *
 * @param {Object} el - the current dragged Element
 * @param {PointerEvent} event - the active pointer move Event
 */
function adjustDraggedElementRect(el, event) {
  dragState.initialRect = el.getBoundingClientRect();
  dragState.offsetX = event.clientX - dragState.initialRect.left;
  dragState.offsetY = event.clientY - dragState.initialRect.top;
}

/**
 * Sets initial objects properties at the end of function {@link startDrag()}
 * @param {Object} el - the current dragged Element
 */
function assignDragStateObject(el) {
  Object.assign(el.style, {
    position: "fixed",
    left: `${dragState.initialRect.left}px`,
    top: `${dragState.initialRect.top}px`,
    width: `${dragState.initialRect.width}px`,
    zIndex: 1000,
  });
}

/**
 * Moves the current dragged element
 * enables Auto-Scroll Function {@link handleAutoScroll()}
 * @param {PointerEvent} event - the active pointer move Event
 */
function pointerMove(event) {
  event.preventDefault();
  dragState.element.style.left = `${event.clientX - dragState.offsetX}px`;
  dragState.element.style.top = `${event.clientY - dragState.offsetY}px`;
  handleAutoScroll(event.clientY);
}

/**
 * Handler for the pointerup event
 * Delegates clearing of Timeout and Drag and Drop related listeners
 * If dragging-state is detected, {@link handleDrop}-function will be called
 *
 * @param {PointerEvent} event - the active pointer up Event
 */
async function pointerUp(event) {
  clearTimeout(dragState.longPressTimer);
  if (dragState.isDragging) {
    suppressClick = true;
    await handleDrop(event);
  }
  cleanupDrag(event);
}

/**
 * Drops the element to the designated column, when dropped over a valid dropzone
 * When the element is released outside the dropzone, it moves back to the source column
 * @param {PointerEvent} event - the active pointer move Event
 */
async function handleDrop(event) {
  const target = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest(".col-content");
  await moveTaskToColumn(target ?? dragState.sourceColumn);
}

/**
 * Handler to call stop functions, to finish drop-process:
 * - stopping auto-scroll
 * - resetting Drag State Object
 * - removing dragging-class
 * - removing pointer-eventlistener
 * @param {PointerEvent} event - the active pointer Up Event
 */
function cleanupDrag(event) {
  stopPointerCapture(event);
  stopAutoScroll();
  dragState.element?.classList.remove("dragging");
  cleanDragStateObject();
  document.removeEventListener("pointermove", pointerMove);
  document.removeEventListener("pointerup", pointerUp);
}

/**
 * Stops Pointer Capture on the dragged Element
 * Condition is that the Element has PointerCapture-flag active
 * @param {PointerEvent} event - the active pointer Up Event
 */
function stopPointerCapture(event) {
  if (
    dragState.hasPointerCapture &&
    dragState.element?.hasPointerCapture?.(event.pointerId)
  ) {
    dragState.element.releasePointerCapture(event.pointerId);
  }
}

/**
 * Sets the element position to DOM-state
 * resets the drageState-Object to default, during {@link cleanupDrag}-function
 */
function cleanDragStateObject() {
  Object.assign(dragState.element.style, {
    position: "",
    left: "",
    top: "",
    width: "",
    zIndex: "",
  });

  Object.assign(dragState, {
    element: null,
    taskIndex: null,
    isDragging: false,
    hasPointerCapture: false,
    longPressTimer: null,
  });
}

/**
 * Handles scrolling direction, depending on the pointer-Y coordinate depending on the containers rectangle
 * Else it will stop scrolling
 * @param {Number} pointerY - the Viewport-Y-coordinate
 */
function handleAutoScroll(pointerY) {
  const container = scrollState.container;
  const rect = container.getBoundingClientRect();
  if (pointerY < rect.top + dragConfig.autoScrollEdge) {
    startAutoScroll(-1);
  } else if (pointerY > rect.bottom - dragConfig.autoScrollEdge) {
    startAutoScroll(1);
  } else {
    stopAutoScroll();
  }
}

/**
 * initialize the requestAnimationFrame-animation, when it hasn't start yet
 * @param {number} direction - controller to determine the scroll direction
 *                           - -1 = up
 *                           -  1 = down
 */
function startAutoScroll(direction) {
  scrollState.direction = direction;
  if (!scrollState.rafId) {
    scrollState.rafId = requestAnimationFrame(scrollLoop);
  }
}

/**
 * Continues scrolling using requestAnimationFrame, 
 * as long as direction property is set to -1 or 1
 */
function scrollLoop() {
  if (!scrollState.direction) {
    scrollState.rafId = null;
    return;
  }
  scrollState.container.scrollTop += scrollState.direction * dragConfig.autoScrollSpeed;
  scrollState.rafId = requestAnimationFrame(scrollLoop);
}

/**
 * Stops the scroll animation, by setting direction property to 0
 */
function stopAutoScroll() {
  scrollState.direction = 0;
}

/**
 * This Function toggles all Drop-Zones
 *
 */
function toggleDragArea() {
  let area = document.querySelectorAll(".col-empty-wrap:last-of-type");
  [...area].forEach((c) => c.classList.toggle("d-none"));
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

/**
 * This Function submits the edited Task to the firebase and reloads the board
 *
 * @param {String} indexTask index of the task
 */
async function submitEditTask(indexTask) {
  let overlay = document.querySelector(".task-overlay-wrap");
  let editedTaskObj = tasksArray[indexTask][1];
  let taskID = tasksArray[indexTask][0];
  let newTaskObj = getNewTaskScalarInformation("", editedTaskObj);
  await updateDatabaseObject(`tasks/${taskID}`, newTaskObj);
  tasksArray = await getTasksArray();
  await submitNewTaskOptionalComplexInfo(taskID);
  await initBoard();
  showToastMessage("add-task-toast-msg");
  closeTaskOverlays();
  setTimeout(() => {
    overlay.innerHTML = "";
  }, 500);
}


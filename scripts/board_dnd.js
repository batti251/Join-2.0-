


/**
 * This builds a new object, useable for the n8n Mail recall
 * This function is called, when a task was moved to another column
 * 
 * @param {Object} currentTask - the task, that has been changed 
 * @param {string} targetStatus - the new status-id 
 * @returns - the new built Object
 */
function mapObject(currentTask, targetStatus){
  let objRef = {}
  let taskRef = currentTask[1]
  objRef = {
    "mail" : taskRef.mail,
    "newStatus" : targetStatus,
    "title" : taskRef.title,
    "name" : taskRef.name ?? taskRef.creator
  }

  return objRef
}

/**
 * This Function triggers the n8n-Webhook Mailing
 * It's triggered, after a task was moved within the board
 * 
 * @param {Object} currentTask - the task, that has been changed 
 * @param {string} targetStatus - the new status-id 
 */
async function sendUpdateMail(currentTask, targetStatus) {
  let obj = mapObject(currentTask, targetStatus)
    fetch(webhookMailUpdate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  })
}

/**
 * Handler for proper task-update
 * It updates the database, if a column or currentTask was set.
 * It also sends an email to the task-creator.
 * 
 * @param {String} column - the target column 
 */
async function moveTaskToColumn(column) {
  if (!column || !currentTask) return;
  const targetStatus = column.id.replace("-", "");
  await updateDatabaseObject(`tasks/${currentTask[0]}/status`, targetStatus);
  await sendUpdateMail(currentTask, targetStatus)
  await initBoard();
}

const dragState = {
  element: null,
  taskIndex: null,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  pointerId: null,
  initialRect: null,
  isDragging: false,
  hasPointerCapture: false,
  longPressTimer: null,
};

const dragConfig = {
  longPressDelay: 250,
  autoScrollEdge: 80,
  autoScrollSpeed: 12,
  threshold: 12,
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
  dragState.element = event.currentTarget.parentElement.parentElement;
  dragState.taskIndex = taskIndex;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.isDragging = false;
  dragState.pointerId = event.pointerId;
  dragState.sourceColumn = event.currentTarget.closest(".col-content");
  dragState.longPressTimer = setTimeout(startDrag, dragConfig.longPressDelay);
}

/**
 * Function handler for setting dragState-Object properly
 *
 */
function startDrag() {
  if (dragState.isDragging || !dragState.element) return;
  setDragStateStart();
  toggleDragArea();
  assignDragStateObject(dragState.element);
}

/**
 * Sets the dragged Element to the necessary states to move it while properly styled
 *
 */
function setDragStateStart() {
  dragState.isDragging = true;
  dragState.hasPointerCapture = true;
  dragState.initialRect = dragState.element.getBoundingClientRect(); //behält Form bei
  dragState.offsetX = dragState.startX - dragState.initialRect.left; //behält Maus an der Stelle
  dragState.offsetY = dragState.startY - dragState.initialRect.top; //behält Maus an der Stelle
  dragState.element.classList.add("dragging");
  currentTask = tasksArray[dragState.taskIndex];
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
  cancelStartDrag(event);
  if (dragState.isDragging) {
    event.preventDefault();
    dragState.element.style.left = `${event.clientX - dragState.offsetX}px`;
    dragState.element.style.top = `${event.clientY - dragState.offsetY}px`;
    handleAutoScroll(event.clientY);
  }
}

/**
 * Function Handler to cancel {@link startDrag}-Function
 * @param {PointerEvent} event - the active pointer move Event
 */
function cancelStartDrag(event) {
  const dx = Math.abs(event.clientX - dragState.startX);
  const dy = Math.abs(event.clientY - dragState.startY);
  if (!dragState.isDragging && (dy > dragConfig.threshold || dx > dragConfig.threshold)) {
    clearTimeout(dragState.longPressTimer);
    cleanupDrag(event);
    return;
  }
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
 * Drops the element to the target column, when dropped over a valid dropzone
 * When the element is released outside the dropzone, it moves back to the source column
 * @param {PointerEvent} event - the active pointer move Event
 */
async function handleDrop(event) {
  const target = document
    .elementsFromPoint(event.clientX, event.clientY)
    .filter((e) => e.className == "col-content")[0];
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
  if (dragState.element) {
    cleanDragStateObject();
  }
  stopPointerCapture(event);
  stopAutoScroll();
  dragState.element?.classList.remove("dragging");
  document.removeEventListener("pointermove", pointerMove);
  document.removeEventListener("pointerup", pointerUp);
}

/**
 * Stops Pointer Capture on the dragged Element
 * Condition is that the Element has PointerCapture-flag active
 * @param {PointerEvent} event - the active pointer Up Event
 */
function stopPointerCapture(event) {
  if (dragState.hasPointerCapture && dragState.element?.hasPointerCapture?.(event.pointerId)) {
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
  scrollState.container.scrollTop +=
    scrollState.direction * dragConfig.autoScrollSpeed;
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

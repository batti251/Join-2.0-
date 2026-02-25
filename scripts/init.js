
let aiCounterRef = [];
let aiCounter = "";
let html = document.getElementById("stakeholder-content")

async function inits() {
  aiCounterRef = await getDataBaseElement("aicounter");
  aiCounter = Object.values(aiCounterRef)
  aiNumber = aiCounter[0].count
  if (aiNumber < 10) {
    html.innerHTML = initWelcomeTemplate(aiNumber)
  } else {
  html.innerHTML = initLimitWelcomeTemplate(aiNumber)
  }
}

function continueProcess(aiNumber){
  html.innerHTML = initHowToTemplate(aiNumber)
}

function rewindProcess(aiNumber){
  html.innerHTML = initWelcomeTemplate(aiNumber)
}


/**
 * Initiates tasks and contacts list
 */
async function initDatabase() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
}

/**
 * Returns an array alphabetically sorted by name.
 *
 * @async
 * @returns {Promise<Array<[string,Object]>>} A promise that resolves to an array of [id, contact] pairs sorted by name.
 */
async function getSortedContactsArray() {
  let contacts = await getDataBaseElement("contacts");
  contactsArray = Object.entries(contacts);
  contactsArray.sort((idValuePairA, idValuePairB) => {
    const nameA = idValuePairA[1].name.toLowerCase();
    const nameB = idValuePairB[1].name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  return contactsArray;
}

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
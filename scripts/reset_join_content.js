let initialContacts = [];

/**
 * Resets total join content
 */
async function resetJoinContent() {
  await deleteDataBaseElements();
  await submitInitialContacts();
  await submitInitialTasks();
  showToastMessage("reset-join-msg");
}

/**
 * Deletes contacts, tasks and users from join.
 */
async function deleteDataBaseElements() {
  await deleteDataBaseElement("contacts");
  await deleteDataBaseElement("tasks");
  await deleteDataBaseElement("user");
}

/**
 * Submits initial contacts to firebase server
 */
async function submitInitialContacts() {
  for (let i = 0; i < initialContacts.length; i++) {
    submitObjectToDatabase("contacts", initialContacts[i]);
  }
}

/**
 * Adds initial contact to initialContacts array
 *
 * @param {string} name contact name
 * @param {string} email contact email
 * @param {string } phone contact phone
 */
function addInitalContact(name, email, phone, checkbox, password, canLogin) {
  initialContact = new InitialContact(name, email, phone, checkbox, password, canLogin);
  initialContacts.push(initialContact);
}

addInitalContact("Anja Schmidt", "schmidt@gmail.com", "49111111111", "on", "11111111", true);
addInitalContact("Markus Müller", "müller@t-online.de", "49222222222", "on", "11111111", true);
addInitalContact("Tanja Meyer", "meyer@web.de", "49333333333", "on", "11111111", true);
addInitalContact("Beate Krause", "krause@gmail.com", "49444444444", "on", "11111111", true);
addInitalContact("Thomas Schneider", "schneider@gmail.com", "49555555555", "on", "11111111", true);
addInitalContact("Sophie Hoffmann", "hoffmann@gmail.com", "49666666666", "on", "11111111", true);
addInitalContact("Lukas Becker", "becker@t-online.de", "49777777777", "on", "11111111", true);
addInitalContact("Axel Fischer", "fischer@gmail.com", "49888888888", "on", "11111111", true);
addInitalContact("Tim Weber", "weber@gmail.com", "49999999999", "on", "11111111", true);
addInitalContact("Theresa Koch", "koch@gmail.com", "49101010101", "on", "11111111", true);

/**
 * Submits initial tasks to firebase server
 */
async function submitInitialTasks() {
  let contactsRef = await getDataBaseElement("contacts");
  let contactsObj = Object.entries(contactsRef);
  taskNew(
    "technical-task",
    "put here Description",
    "2025-12-12",
    "low",
    "triage",
    "First Test Task",
    [{ Id: contactsObj[1][0], name: contactsObj[1][1].name }],
    [
      { name: "subtask1", done: true },
      { name: "subtask2", done: false },
    ],
    "human",
    contactsObj[3][1].name,
    contactsObj[3][0]
  );
  taskNew(
    "technical-task",
    "responsive Reset SE?",
    "2025-11-12",
    "medium",
    "todo",
    "Reset responsive iPhone SE?",
    [
      { Id: contactsObj[2][0], name: contactsObj[2][1].name },
      { Id: contactsObj[3][0], name: contactsObj[3][1].name },
    ],
    [
      { name: "subtask1", done: true },
      { name: "subtask2", done: false },
    ],
    "human",
    contactsObj[3][1].name,
    contactsObj[3][0]
  );
  taskNew(
    "user-story",
    "",
    "2025-02-12",
    "urgent",
    "inprogress",
    "call Boss",
    [],
    [
      { name: "call Boss", done: false },
      { name: "cry", done: false },
    ],
    "human",
    contactsObj[3][1].name,
    contactsObj[3][0]
  );
  taskNew(
    "user-story",
    "please add AssignedTo",
    "2025-08-20",
    "urgent",
    "awaitfeedback",
    "finish Reset-Function",
    [{ Id: contactsObj[3][0], name: contactsObj[3][1].name }],
    [
      { name: "subtask1", done: true },
      { name: "subtask2", done: true },
    ],
    "human",
    contactsObj[3][1].name,
    contactsObj[3][0]
  );
  taskNew(
    "technical-task",
    "",
    "2025-10-12",
    "urgent",
    "inprogress",
    "El Pollo Loco!",
    [{ Id: contactsObj[6][0], name: contactsObj[6][1].name }],
    [],
    "human",
    contactsObj[6][1].name,
    contactsObj[6][0]
  );
}

/**
 * Creates new object classed as task
 *
 * @param {string} category task category
 * @param {string} description task description
 * @param {string} dueDate task due date
 * @param {string} priority task priority
 * @param {string} status task status
 * @param {string} title task title
 * @param {array} assignedTo task assigned contacts
 * @param {array} subtasks task subtasks
 * @param {array} source task subtasks
 * @param {array} creator creator of the task
 * @param {array} creatorId creatorId of the task
 */
function taskNew(category,description,dueDate,priority,status,title,assignedTo,subtasks,source, creator, creatorId) {
  new Task(category,description,dueDate,priority,status,title,assignedTo,subtasks,source, creator, creatorId);
}




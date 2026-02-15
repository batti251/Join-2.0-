class Task{

    assignedTo;
    category;
    description;
    dueDate;
    priority;
    status;
    title;
    assignedTo;
    subtasks;
    source;
    creator;
    creatorId;
    assignedToArray = []




    constructor(category, description, dueDate, priority, status, title,assignedTo, subtasks, source, creator, creatorId){
        this.category = category;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.title = title;
        this.assignedTo = assignedTo;
        this.subtasks = subtasks;
        this.source = source;
        this.creator = creator;
        this.creatorId = creatorId;
        this.loadNewTask();
    }

    async loadNewTask() {
        let newTaskObj = {
        category: this.category,
        description: this.description,
        dueDate: this.dueDate,
        priority: this.priority,
        status: this.status,
        title: this.title,
        assignedTo: this.assignedTo,
        subtasks: this.subtasks,
        source: this.source,
        creator: this.creator,
        creatorId: this.creatorId
        };
        await submitObjectToDatabase("tasks", newTaskObj);
    }


    

 async validateUser() {
    console.log("NÖTIG");
  let userID = sessionStorage.getItem("id")
  let validUser = contactsArray.findIndex((e) => e[0] == userID)
  return validUser
}



    newAddTask() {
        let form = document.getElementById('form-add-task');
        let formData = new FormData(form)
            for (const [key,value] of formData) {
                if (key == "subtasks") {
                    this[key] = newTaskSubtasks  
                } 
                else if (key == "assignedTo") {
                    this.assignedToFunction()
                }
                else {
                    this[key] = value
                }
                this.addMetaProperties()
            }
        return this
        }

        
        addMetaProperties(){
                this.source = "human";
                this.status = "triage";
                this.creator = sessionStorage.getItem("user");
                this.creatorId = sessionStorage.getItem("id");
                this.category = this.getTaskCategoryFirebaseName()
        }


/**
 * Sets new task priority button
 *
 * @param {string} htmlId
 */
 setTaskPriority(htmlId) {
  resetAllPriorityBtns();
  let activeBtn = document.getElementById(htmlId);
  switch (htmlId) {
    case "task-priority-urgent":
      activeBtn.classList.add("active-urgent");
      this.priority = "urgent";
      break;
    case "task-priority-low":
      activeBtn.classList.add("active-low");
      this.priority = "low";
      break;
    default:
      activeBtn.classList.add("active-medium");
      this.priority = "medium";
      break;
  }
}



/**
 * Opens Task Category Dropdown
 */
 openTaskCategoryDropdown() {
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
 * Gets taks category firebase name
 *
 * @returns task category firebase name
 */
 getTaskCategoryFirebaseName() {
  let key = "";
  key = getInputTagValue("task-category");
  if (key.includes("Technical")) {
    return "technical-task";
  } else {
    return "user-story";
  }
}


/**
 * Toggle assignment of a contact
 *
 * @param {string} contactID
 * @param {htmlElement} htmlElement
 */
 toggleAssignContact(contactID, htmlElement) {  
  htmlElement.classList.toggle("focus");
  this.toggleValueFromArray(contactID, newTaskAssignedContactsIndices);
  renderContactsBadges(newTaskAssignedContactsIndices);
}


/**
 * Toggle an arbitrary value from an array
 *
 * @param {*} value arbitrary value
 * @param {*} array array
 */
 toggleValueFromArray(value, array) {
  let index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
  this.assignedTo = array
}



/**
 * Sets a subtask's status
 *
 * @param {htmlElement} currentElement
 * @param {integer} indexTask
 * @param {string} subtaskID
 */
async setSubtaskStatus(currentElement, indexTask, subtaskID) {
    console.log("NÖTIG"); //yes
  let path = tasksArray[indexTask][0];
  let obj = currentElement.checked;
  
  await updateDatabaseObject(`tasks/${path}/subtasks/${subtaskID}/done`, obj);
  await initBoard();
}



/**
 * Adds a subtask to add task form
 */
 addSubtask() {
    console.log("NÖTIG"); //yes
  if (this.subtaskValidation()) {
    return;
  } else {
    this.normalizeSubtasksArray();
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
 subtaskValidation() {
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
 editSubtask(indexSubtask) {
  console.log("nötig");
  
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
addEditedSubtask(indexSubtask) {
  let inputRef = "task-subtask-edit-" + String(indexSubtask);
  let editedSubtaskName = getInputTagValue(inputRef);
  newTaskSubtasks[indexSubtask].name = editedSubtaskName;
  renderSubtasks();
}

/**
 * Deletes a subtask from add task form
 *
 * @param {integer} indexSubtask
 */
 deleteSubtask(indexSubtask) {
  newTaskSubtasks.splice(indexSubtask, 1);
  renderSubtasks();
}


/**
 * Submits a new subtask to add task form if user presses enter key
 *
 * @param {event} event
 */
 addSubtaskOnEnterPress(event) {
    console.log("NÖTIG"); //yes
  if (event.key === "Enter") {
    this.addSubtask();
    event.preventDefault();
  }
}

/**
 * Removes firebase id from subtasks array pulled from firebase server.
 */
 normalizeSubtasksArray() {
    console.log("NÖTIG"); //yes
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
  /* subtasksNormalized = true; */
}



assignedToFunction() {
for (let contactID of newTaskAssignedContactsIndices) {
    let assignedContactEntry = contactsArray.find(
      (entry) => entry[0] === contactID
    );
    if (assignedContactEntry) {
      let keyValuePairs = {
        Id: contactID,
        name: assignedContactEntry[1].name,
      };
      this.assignedToArray.push(keyValuePairs)
    }
}
    this.assignedTo = this.assignedToArray
}


}

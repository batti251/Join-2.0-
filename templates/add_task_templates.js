function getSubtaskListTemplate(indexSubtask) {
  return `
        <li id="task-subtask-${indexSubtask}" class="p-relative subtask-list-element">
            <div>&#x2022;</div>
            ${newTaskSubtasks[indexSubtask].name}
            <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
                <span class="task-edit-subtask-icon" onclick="obj.editSubtask(${indexSubtask})"></span>
                <span class="separator-subtask-edit-delete-icons"></span>
                <span class="task-delete-subtask-icon" onclick="obj.deleteSubtask(${indexSubtask})"></span>    
            </div>
        </li>
    `;
}

function getEditSubtaskTemplate(indexSubtask) {
  return `
    <input type="text" class="p-relative font-Inter-400-13px subtask-list-element edit-subtask" id="task-subtask-edit-${indexSubtask}" value="${newTaskSubtasks[indexSubtask].name}"></input>
        <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
            <div class="d-flex-row-c-c task-subtask-icon-wrap">
                <span class="task-delete-subtask-icon" onclick="obj.deleteSubtask(${indexSubtask})"></span>
            </div>
            <span class="separator-subtask-edit-delete-icons"></span>
            <div class="d-flex-row-c-c task-subtask-icon-wrap">
                <span class="task-submit-subtask-icon" onclick="obj.addEditedSubtask(${indexSubtask})"></span>
            </div>    
        </div>
    `;
}

function getTaskAssigendContactsTemplate(contactID, indexContact) {
  return `
    <div id="task-assigned-contact-wrap-${contactID}" onclick="obj.toggleAssignContact('${contactID}',this)">
      <div class="pd-8px-16px task-assigned-contact-wrap d-flex-c-sb">
        <div class="d-flex-row-c-fs gap-16px">
            <div name="assignTo" class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassNameByFirebaseId(
              contactID
            )}">
                ${getFirstTwoStringInitialsByFirebaseId(contactID)}
            </div>
            ${contactsArray[indexContact][1].name}
        </div>
        <span class="task-assigned-contacts-checkbox-icon"></span>
      </div>
    </div>
    `;
}

function getTaskAssigendContactsOverlayTemplate(contactID, indexContact) {
  return `
    <div id="task-assigned-contact-wrap-overlay-${contactID}" onclick="obj.toggleAssignContact('${contactID}',this)">
      <div class="d-flex-c-sb pd-8px-16px task-assigned-contact-wrap">  
      <div class="d-flex-row-c-fs gap-16px">
            <div class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassNameByFirebaseId(
              contactID
            )}">
                ${getFirstTwoStringInitialsByFirebaseId(contactID)}
            </div>
            ${contactsArray[indexContact][1].name}
        </div>
        <span class="task-assigned-contacts-checkbox-icon"></span>
      </div>
    </div>
    `;
}

function getTaskAssignedContactBadgeTemplate(contactID, indexContact) {
  return `
    <div class="profile-badge ${getContactColorClassNameByFirebaseId(
      contactID
    )}">
        ${getFirstTwoStringInitialsByFirebaseId(contactID)}
    </div>
    `;
}

function getTaskAssignedContactsRemainderTemplate(numberRemainder) {
  return `
  <div class="assigned-user-remainder">
    +${numberRemainder}
  </div>
  `;
}

function getAddTaskFormTemplate(taskStatusId) {
  return `
  <form
    id="form-add-task"
    onsubmit="addNewTask('${taskStatusId}'); event.preventDefault() "
  >
    <div class="form-sub-wraps">
      <div class="task-main">
        <div class="task-area task-title">
          <label
            for="task-title"
            class=""
            >Title<span class="text-red">*</span></label
          >
          <input
            class="task-input-border task-input-text-field required"
            type="text"
            id="task-title"
            placeholder="Enter a title"
            oninput="resetErrorMessage()"
            name="title"
          />
          <div class="d-none validation">This field is required!</div>
        </div>

        <div class="task-area">
          <label
            for="task-description"
            class=""
            >Description</label
          >
          <textarea
            class="task-input-border task-input-text-area"
            id="task-description"
            name="description"
            placeholder="Enter a Description"
          ></textarea>
        </div>
        <div class="task-area tas-title">
          <label for="task-due-date" class="input-label"
            >Due date<span class="col-red">*</span></label
          >
          <input
            class="task-input-border task-input-date required"
            type="date"
            min="${currentDate}"
            id="task-due-date"
            placeholder="dd/mm/yyyy"
            oninput="resetErrorMessage()"
            onclick="this.showPicker()"
            name="dueDate"
          />
           <div class="d-none validation">This field is required!</div>
        </div>
        
      </div>

      <div class="separator"></div>

      <div class="task-meta">
        <div class="task-area">
          <label class=""
            >Priority</label
          >
          <div class="overlay-priority">
            <button
              type="button"
              class="btn-priority"
              id="task-priority-urgent"
              onclick="obj.setTaskPriority('task-priority-urgent')"
            >
              <span>Urgent</span>
              <span class="btn-priority-icon urgent-icon"></span>
            </button>
            <button
              type="button"
              class="btn-priority active-medium"
              id="task-priority-medium"
              onclick="obj.setTaskPriority('task-priority-medium')"
            >
              <span>Medium</span>
              <span class="btn-priority-icon medium-icon"></span>
            </button>
            <button
              type="button"
              class="btn-priority"
              id="task-priority-low"
              onclick="obj.setTaskPriority('task-priority-low')"
            >
              <span>Low</span>
              <span class="btn-priority-icon low-icon"></span>
            </button>
          </div>
        </div>

        <div class="task-area" onclick="event.stopPropagation(), setZIndex(this)">
          <label
            for="task-assigned-contacts"
            class=""
            >Assigned To</label
          >
          <input
            class="task-input-border task-input-category"
            type="text"
            id="task-assigned-contacts"
            placeholder="Select contacts to assign"
            oninput="searchContact()"
            onclick="openTaskAssignedContactsDropdown()"
            name="assignedTo"
            autocomplete="off"
          />
          <span
            class="task-dropdown-icon p-relative"
            id="task-assigend-contacts-dropdown-icon"
          ></span>
          <div
            class="d-none task-input-dropdown p-absolute"
            id="task-assigned-contacts-dropdown"
          ></div>
          <div
            class="profile-wrap"
            id="task-assigned-contacts-badges"
          ></div>
        </div>

        <div class="task-area task-category" onclick="event.stopPropagation() , setZIndex(this)">
          <label
            for="task-category"
            class=""
            >Category<span class="text-red">*</span></label
          >
          <input
            class="task-input-border task-input-category required"
            type="text"
            id="task-category"
            placeholder="Select task category"
            onclick="obj.openTaskCategoryDropdown()"
            name="category"
            autocomplete="off"
            oninput="resetErrorMessage()"
            readonly
          />
          <span
            class="task-dropdown-icon"
            id="task-category-dropdown-icon"
          ></span>
          <div
            class="d-none p-absolute task-input-dropdown"
            id="task-category-dropdown"
          >
            <div
              class="task-category-option"
              onclick="setInputTagValue('task-category', this.innerHTML),closeTaskCategoryDropdown() "
            >Technical Task
            </div>
            <div
              class="task-category-option"
              onclick="setInputTagValue('task-category', this.innerHTML), closeTaskCategoryDropdown()"
            >User Story
            </div>
          </div>
           <div class="d-none validation">This field is required!</div>
        </div>

        <div class="task-area">
          <label
            for="task-subtasks"
            class=""
            >Subtasks</label
          >
          <input
            oninput="showSubtaskControlButtons()"
            onkeypress="obj.addSubtaskOnEnterPress(event)"
            class="p-relative task-input-border task-input-category "
            type="text"
            id="task-subtasks"
            name="subtasks"
            placeholder="Add new subtask"
          />
          <span
            class="p-absolute task-subtask-icon task-add-subtask-icon"
            id="task-add-subtask-icon"
          ></span>
          <div
            class="d-none p-absolute task-subtask-icon"
            id="task-clear-submit-subtask-icon-wrap"
          >
            <div
              class="d-flex-row-c-c task-subtask-icon-wrap"
              onclick="clearInputTagValue('task-subtasks')"
            >
              <span class="task-clear-subtask-icon"></span>
            </div>
            <span class="separator"></span>
            <div
              class="d-flex-row-c-c task-subtask-icon-wrap"
              onclick="obj.addSubtask()"
            >
              <span class="task-submit-subtask-icon"></span>
            </div>
          </div>
          <ul class="tasks-subtask-list" id="tasks-subtasks-list"></ul>
        </div>
      </div>
    </div>

    <div class="task-button-mobile">
      <div class="text-required">
        <span class="text-red">*</span>This field is required
      </div>

      <div class="task-form-btn-wrap">
        <button
          class="btn-clear"
          type="reset"
          onclick="clearAddTaskForm()"
        >
          <span class="">Clear</span>
          <span class="btn-clear-icon"></span>
        </button>
        <button
          class="task-form-btn btn-submit"
          type="submit"
        >
          <span class="">Create Task</span>
          <span class="submit-task-btn-icon"></span>
        </button>
      </div>
    </div>
  </form>
`;
}

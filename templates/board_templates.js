function getBoardCardTemplate(indexTask) {
  return `
    <div class="task-card-wrap"  onclick="handleTaskClick(${indexTask})"  >
          <div class="task-card" >
            <div>
              <div class="task-category ${getTaskCategoryClass(
                tasksArray[indexTask][1].category
              )} ">${getCategoryNameTemplate(
    tasksArray[indexTask][1].category
  )}</div>
            </div>
            <div class="task-description-wrap">
                <div class="task-headline">${
                  tasksArray[indexTask][1].title
                }</div>
                <div class="task-description">${
                  tasksArray[indexTask][1]?.description || ""
                }</div>   
            </div>
            <div class="" id="subtasks-progress-${indexTask}"></div>
            <div class="task-priority-wrap">
                    <div class="task-badge" id="task-contacts-${indexTask}">
                    </div>
                    <img src=${getTaskPriorityIconSrc(
                      tasksArray[indexTask][1].priority
                    )} >
            </div>
              <div class="drag-handler " onpointerdown="pointerDown(event, ${indexTask})">_</div>
        </div> 


    </div>
    <div class="d-none col-empty-wrap"></div>
    `;
}

function getNoTask(title) {
  return `
    <div class="no-task-feedback">No Tasks ${title}</div>
    <div class="d-none col-empty-wrap"></div>
    `;
}

function getTaskCardSubtaskTemplate(indexTask) {
  return `
  <div class="progress-bar">
    <div class="progress-bar-status" id="progress-${indexTask}"></div>
  </div>
  <span class="progress-text">
    ${getTaskCompletedSubtasksNumber(indexTask)}/${
    tasksArray[indexTask][1].subtasks.length
  } Subtasks
  </span>
  `;
}

function getTaskCardContactsTemplate(indexTaskContact, indexTask) {
  return `
  <div class="task-card-contact-badge ${getContactColorClassNameByFirebaseId(
    tasksArray[indexTask][1].assignedTo[indexTaskContact][1].Id
  )}">
    <div class="badge-text">
      ${getFirstTwoStringInitialsByFirebaseId(
        tasksArray[indexTask][1].assignedTo[indexTaskContact][1].Id
      )}
    </div>
  </div>
  `;
}

function getTaskOverlay(indexTask, currentTask, overlay) {
  console.log(currentTask);
  
  overlay.innerHTML = `
    <div class="task-overlay">
    <div class=" task-overlay-category">
      <div class="task-category ${getTaskCategoryClass(
        currentTask.category
      )} ">${getCategoryNameTemplate(currentTask.category)}
      </div>
      <div class="ai right">
      ${currentTask.source == "human" ? "" : `<img src="../assets/icons/wand-stars.svg" >Ai-generated ticket` }
      </div>
        <div class="close-icon-overlay-wrap">
          <div class="close-icon-overlay" onclick="closeTaskOverlays()">
            <img src="../assets/icons/close.svg" aslt="close" class="close-icon"/>
          </div>
        </div>
      </div>

    <h2 class="task-overlay-title">${
      currentTask.title
    }</h2>

    <div class="task-overlay-desc">${
      currentTask?.description || ""
    }</div>

    <div class="task-overlay-meta-wrap creator">
      <div class="creator-primary">Creator:</div>
      
      
      ${
        currentTask.creator == "external" ? `<div class="creator-external"><img src="../assets/icons/world.svg"> Extern </div><div>${currentTask.name}</div><a href="mailto:${currentTask.mail}" class="email-externalal"><img src="../assets/icons/mail_attach.svg">E-Mail</a>` : 
        `<div class="creator-internal"><img src="../assets/icons/member.svg"> Member </div><div>${currentTask.creator}</div><a href="/html/contacts.html?id=${currentTask.creatorId ? currentTask.creatorId : ""}" class="email-internal"><img src="../assets/icons/person_blue.svg">Profil</a>`
      }
    </div>


    <div class="task-overlay-meta-wrap">
      <div class="due-date-primary">Due date:</div>
      <div class="">${
        currentTask.dueDate
      }</div>
    </div>

    <div class="task-overlay-meta-wrap">
      <div class="priority-primary">Priority: </div>
      <div class="">${currentTask.priority} 
      <img src=${getTaskPriorityIconSrc(currentTask.priority)} ></div>
    </div>

    <div class="task-overlay-assignment-wrap">
      <div class="assigned-primary">Assigned To:</div>
      <article class="">${
        currentTask.assignedTo
          ?.map(
            (p) => `
        <div class="task-overlay-contact-wrap">
          <div class="task-overlay-contact">
            <div class="task-card-contact-badge ${getContactColorClassNameByFirebaseId(
              p[1].Id
            )}">
              <div class="badge-text">${getFirstTwoStringInitialsByFirebaseId(
                p[1].Id
              )}
              </div>
            </div>
          <div class="assigned-user">${p[1].name}</div>
          </div>
        </div>`
          )
          .join("") || ""
      }
      </article>
    </div>

    <div class="task-overlay-assignment-wrap">
      <div class="">Subtasks</div>
      <article>${
        currentTask.subtasks
          ?.map(
            (s) =>
              ` <div class="input-container d-flex"><div class="input-checkbox task-overlay-checkbox-wrap"><input type="checkbox" name="checkbox-subtask" ${
                s[1].done ? "checked" : ""
              } onclick="obj.setSubtaskStatus(this, ${indexTask}, '${
                s[0]
              }')"><div>${s[1].name}</div></div></div>`
          )
          .join("") || ""
      }</article>
    </div>

    <div class="edit-delete-wrap">
                <button
                class="contact-details-edit-contact"
                onclick="editTask(${indexTask})"
                >
                <img
                    src="../assets/icons/edit.svg"
                    alt="edit pencil"
                    class="edit-contact-icon"
                />
                <span class="edit-contact-text">Edit</span>
                </button>
                <button class="contact-details-delete-contact" onclick="deleteTask(${indexTask})">
                <img
                    src="../assets/icons/delete.svg"
                    alt="delete trash bin"
                    class="delete-contact-icon"
                />
                <span class="edit-contact-text">Delete</span>
                </button>
            </div>
      </div>
  `;
}

function editTaskTemplate(indexTask, currentTask) {
  return `
  <div class="scroll-overlay">

     <div class=" task-overlay-category">
      <div class="task-category ${getTaskCategoryClass(
        currentTask.category
      )} ">${getCategoryNameTemplate(currentTask.category)}</div>
        <div class="close-icon-overlay-wrap">
          <div class="close-icon-overlay" onclick="closeTaskOverlays()">
            <img src="../assets/icons/close.svg" aslt="close" class="close-icon"/>
          </div>
        </div>
      </div>


<form class="" id="form-edit-task" onsubmit="submitEditTask(${indexTask})">
            <div class="form-edit-task-wrap">
              <div class="task-main">
                <div class="task-area task-title">
                  <label
                    for="task-title"
                    class=""
                    >Title<span class="col-red">*</span></label
                  >
                  <input
                    class="task-input-border task-input-text-field editable required"
                    type="text"
                    id="task-title"
                    name="title"
                    value="${currentTask.title}"
                    
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
                    class="task-input-border task-input-text-area editable"
                    id="task-description"
                    name="description"
                  >${currentTask?.description || ""}</textarea>
                </div>
                <div class="task-area task-title">
                  <label for="task-due-date" class="input-label"
                    >Due date<span class="col-red">*</span></label
                  >
                  <input
                    class="task-input-border task-input-date editable required"
                    type="date"
                    min="${currentDate}"
                    id="task-due-date"
                    value="${currentTask.dueDate}"
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
                      class="btn-priority ${
                        currentTask.priority == "urgent"
                          ? `active-${currentTask.priority}`
                          : ""
                      }"
                      id="task-priority-urgent"
                      onclick="obj.setTaskPriority('task-priority-urgent')"
                      
                    >
                      <span>Urgent</span>
                      <span class="btn-priority-icon urgent-icon"></span>
                    </button>
                    <button
                      type="button"
                      class="btn-priority  ${
                        currentTask.priority == "medium"
                          ? `active-${currentTask.priority}`
                          : ""
                      }"
                      id="task-priority-medium"
                      onclick="obj.setTaskPriority('task-priority-medium')"
                    >
                      <span>Medium</span>
                      <span class="btn-priority-icon medium-icon"></span>
                    </button>
                    <button
                      type="button"
                      class="btn-priority  ${
                        currentTask.priority == "low"
                          ? `active-${currentTask.priority}`
                          : ""
                      }"
                      id="task-priority-low"
                      onclick="obj.setTaskPriority('task-priority-low')"
                    >
                      <span>Low</span>
                      <span class="btn-priority-icon low-icon"></span>
                    </button>
                  </div>
                </div>

                <div class="task-area z-index-1" onclick="event.stopPropagation()">
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
                    name="assignedTo"
                    onclick="openTaskAssignedContactsDropdown()"
                    autocomplete="off"
                  />
                  <span
                    class="task-dropdown-icon"
                    id="task-assigend-contacts-dropdown-icon"
                  ></span>
                  <div
                    class="d-none task-input-dropdown"
                    id="task-assigned-contacts-dropdown"
                  ></div>
                  <div
                    class="profile-wrap"
                    id="task-assigned-contacts-badges"
                  >
                
                  </div>
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
                    class="task-input-border task-input-category"
                    type="text"
                    name="subtasks"
                    id="task-subtasks"
                    value="${currentTask?.subtask || ""}"
                  />
                  <span
                    class="task-subtask-icon task-add-subtask-icon"
                    id="task-add-subtask-icon"
                  ></span>
                  <div
                    class="d-none task-subtask-icon"
                    id="task-clear-submit-subtask-icon-wrap"
                  >
                    <div
                      class="task-subtask-icon-wrap"
                      onclick="clearInputTagValue('task-subtasks')"
                    >
                      <span class="task-clear-subtask-icon"></span>
                    </div>
                    <span class="separator"></span>
                    <div
                      class="task-subtask-icon-wrap"
                      onclick="obj.addSubtask()"
                    >
                      <span class="task-submit-subtask-icon"></span>
                    </div>
                  </div>
                  <ul class="tasks-subtask-list" id="tasks-subtasks-list">
                  ${
                    currentTask.subtasks
                      ?.map(
                        (s, i) => ` 
                            <li id="task-subtask-${i}" class="subtask-list-element">
            <div>&#x2022; <span class="new-input">${s[1].name}</span></div>
            
            <div class="task-subtask-control-icon-wrap">
                <span class="task-edit-subtask-icon" onclick="obj.editSubtask(${i})"></span>
                <span class="separator-subtask-edit-delete-icons"></span>
                <span class="task-delete-subtask-icon" onclick="obj.deleteSubtask(${i})"></span>    
            </div>
        </li>
                    `
                      )
                      .join("") || ""
                  }
                  </ul>
                </div>
              </div>
            </div>

            <div class="task-button-mobile">
              <div class="text-required">
                <span class="text-red">*</span>This field is required
              </div>

              <div class="task-form-btn-wrap">
                <button
                  class="task-form-btn btn-submit btn-edit"
                  type="submit"
                >
                  <span class="">Ok</span>
                  <span class="submit-task-btn-icon"></span>
                </button>
              </div>
            </div>
          </form>
        </div>`;
}

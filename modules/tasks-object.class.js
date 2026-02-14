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

     
}


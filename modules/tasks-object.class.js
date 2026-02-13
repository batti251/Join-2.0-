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

    constructor(category, description, dueDate, priority, status, title,assignedTo, subtasks, source){
        this.category = category;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.title = title;
        this.assignedTo = assignedTo;
        this.subtasks = subtasks;
        this.source = source;
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
        source: this.source
        };
        await submitObjectToDatabase("tasks", newTaskObj);
    }

     
}


export class Task {
  constructor({ id, title, completed, userId }) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.userId = userId;
  }

  toggle() {
    this.completed = !this.completed;
  }

  getStatus() {
    return this.completed ? "Completed" : "Pending";
  }

  isOverdue() {
    return !this.completed;
  }
}

export class PriorityTask extends Task {
  constructor({
    id,
    title,
    completed,
    userId,
    priority = "low",
    dueDate = null,
  }) {
    super({ id, title, completed, userId });
    this.priority = priority;
    this.dueDate = dueDate;
  }

  getStatus() {
    return `${super.getStatus()} | Priority: ${this.priority}`;
  }
}

export class User {
  constructor({ id, name, email }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getCompletionRate() {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter((t) => t.completed).length;
    return (completed / this.tasks.length) * 100;
  }

  getTasksByStatus(status) {
    return this.tasks.filter((t) => t.getStatus().includes(status));
  }
}

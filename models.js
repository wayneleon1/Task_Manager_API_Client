class Task {
  constructor(id, title, completed, userId) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.userId = userId;
  }

  static toggle(task) {
    task.completed = !task.completed;
  }

  static isOverdue(task) {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return !task.completed && dueDate < now;
  }

  static getStatus(task) {
    if (task.completed) {
      return "Completed";
    } else if (Task.isOverdue(task)) {
      return "Overdue";
    } else {
      return "Pending";
    }
  }
  static getUserId(task) {
    return task.userId;
  }
}

class PriorityTask extends Task {
  constructor(priority, dueDate) {
    super(id, title, completed, userId);
    this.priority = priority;
    this.dueDate = dueDate;
  }
}

class User {
  constructor(id, name, email, tasks = []) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.tasks = tasks;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getCompletionRate() {
    if (this.tasks.length === 0) return 0;
    const completedTasks = this.tasks.filter((task) => task.completed).length;
    return (completedTasks / this.tasks.length) * 100;
  }

  getTasksByStatus(status) {
    return this.tasks.filter((task) => Task.getStatus(task) === status);
  }
}

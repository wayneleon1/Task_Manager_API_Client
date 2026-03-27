import { Task, PriorityTask, User } from "../../model/models.js";

describe("Task Class", () => {
  let task;
  const validTaskData = {
    id: 1,
    title: "Complete project",
    completed: false,
    userId: 1,
  };

  beforeEach(() => {
    task = new Task(validTaskData);
  });

  describe("Constructor Initialization", () => {
    test("should create task with all properties", () => {
      expect(task.id).toBe(1);
      expect(task.title).toBe("Complete project");
      expect(task.completed).toBe(false);
      expect(task.userId).toBe(1);
    });

    test("should handle null values gracefully", () => {
      const nullTask = new Task({
        id: null,
        title: null,
        completed: null,
        userId: null,
      });
      expect(nullTask.id).toBeNull();
      expect(nullTask.title).toBeNull();
      expect(nullTask.completed).toBeNull();
      expect(nullTask.userId).toBeNull();
    });

    test("should handle undefined properties", () => {
      const undefinedTask = new Task({});
      expect(undefinedTask.id).toBeUndefined();
      expect(undefinedTask.title).toBeUndefined();
      expect(undefinedTask.completed).toBeUndefined();
      expect(undefinedTask.userId).toBeUndefined();
    });

    test("should handle empty string values", () => {
      const emptyTask = new Task({
        id: 1,
        title: "",
        completed: false,
        userId: 1,
      });
      expect(emptyTask.title).toBe("");
    });
  });

  describe("toggle() method", () => {
    test("should change completion status from false to true", () => {
      expect(task.completed).toBe(false);
      task.toggle();
      expect(task.completed).toBe(true);
    });

    test("should change completion status from true to false", () => {
      task.completed = true;
      task.toggle();
      expect(task.completed).toBe(false);
    });

    test("should toggle multiple times correctly", () => {
      task.toggle();
      expect(task.completed).toBe(true);
      task.toggle();
      expect(task.completed).toBe(false);
      task.toggle();
      expect(task.completed).toBe(true);
    });
  });

  describe("getStatus() method", () => {
    test('should return "Pending" when task is not completed', () => {
      expect(task.getStatus()).toBe("Pending");
    });

    test('should return "Completed" when task is completed', () => {
      task.completed = true;
      expect(task.getStatus()).toBe("Completed");
    });
  });

  describe("isOverdue() method", () => {
    test("should return true for pending tasks", () => {
      expect(task.isOverdue()).toBe(true);
    });

    test("should return false for completed tasks", () => {
      task.completed = true;
      expect(task.isOverdue()).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    test("should handle boolean values correctly", () => {
      const taskWithFalse = new Task({ ...validTaskData, completed: false });
      expect(taskWithFalse.getStatus()).toBe("Pending");

      const taskWithTrue = new Task({ ...validTaskData, completed: true });
      expect(taskWithTrue.getStatus()).toBe("Completed");
    });

    test("should handle special characters in title", () => {
      const specialTask = new Task({
        ...validTaskData,
        title: "Task with @#$%^&*()",
      });
      expect(specialTask.title).toBe("Task with @#$%^&*()");
    });
  });
});

describe("PriorityTask Class", () => {
  let priorityTask;
  const validPriorityData = {
    id: 2,
    title: "Urgent task",
    completed: false,
    userId: 1,
    priority: "high",
    dueDate: new Date("2024-12-31"),
  };

  beforeEach(() => {
    priorityTask = new PriorityTask(validPriorityData);
  });

  describe("Inheritance", () => {
    test("should inherit from Task class", () => {
      expect(priorityTask).toBeInstanceOf(Task);
      expect(priorityTask).toBeInstanceOf(PriorityTask);
    });

    test("should have inherited properties", () => {
      expect(priorityTask.id).toBe(2);
      expect(priorityTask.title).toBe("Urgent task");
      expect(priorityTask.completed).toBe(false);
      expect(priorityTask.userId).toBe(1);
    });
  });

  describe("Priority-specific properties", () => {
    test("should initialize with priority property", () => {
      expect(priorityTask.priority).toBe("high");
    });

    test("should initialize with dueDate property", () => {
      expect(priorityTask.dueDate).toEqual(new Date("2024-12-31"));
    });

    test("should handle default priority value", () => {
      const defaultPriorityTask = new PriorityTask({
        id: 3,
        title: "Regular task",
        completed: false,
        userId: 1,
      });
      expect(defaultPriorityTask.priority).toBe("low");
      expect(defaultPriorityTask.dueDate).toBeNull();
    });
  });

  describe("Overridden getStatus() method", () => {
    test("should include priority information in status", () => {
      expect(priorityTask.getStatus()).toBe("Pending | Priority: high");
    });

    test("should work with completed tasks", () => {
      priorityTask.completed = true;
      expect(priorityTask.getStatus()).toBe("Completed | Priority: high");
    });
  });

  describe("Priority validation", () => {
    test("should accept valid priority levels", () => {
      const priorities = ["low", "medium", "high"];
      priorities.forEach((priority) => {
        const task = new PriorityTask({
          ...validPriorityData,
          priority,
        });
        expect(task.priority).toBe(priority);
      });
    });
  });
});

describe("User Class", () => {
  let user;
  let task1, task2, task3;
  const validUserData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    user = new User(validUserData);
    task1 = new Task({ id: 1, title: "Task 1", completed: true, userId: 1 });
    task2 = new Task({ id: 2, title: "Task 2", completed: false, userId: 1 });
    task3 = new Task({ id: 3, title: "Task 3", completed: true, userId: 1 });
  });

  describe("Constructor initialization", () => {
    test("should create user with all properties", () => {
      expect(user.id).toBe(1);
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
      expect(user.tasks).toEqual([]);
    });
  });

  describe("addTask() method", () => {
    test("should add a single task to user", () => {
      user.addTask(task1);
      expect(user.tasks).toHaveLength(1);
      expect(user.tasks[0]).toBe(task1);
    });

    test("should add multiple tasks to user", () => {
      user.addTask(task1);
      user.addTask(task2);
      user.addTask(task3);
      expect(user.tasks).toHaveLength(3);
    });
  });

  describe("getCompletionRate() method", () => {
    test("should calculate correct completion rate with tasks", () => {
      user.addTask(task1);
      user.addTask(task2);
      user.addTask(task3);
      expect(user.getCompletionRate()).toBe(66.66666666666666);
    });

    test("should return 0 when no tasks exist", () => {
      expect(user.getCompletionRate()).toBe(0);
    });

    test("should return 100 when all tasks are completed", () => {
      user.addTask(task1);
      user.addTask(task3);
      expect(user.getCompletionRate()).toBe(100);
    });

    test("should return 0 when no tasks are completed", () => {
      user.addTask(task2);
      expect(user.getCompletionRate()).toBe(0);
    });
  });

  describe("getCompletedTasks() method", () => {
    test("should return correct number of completed tasks", () => {
      user.addTask(task1);
      user.addTask(task2);
      user.addTask(task3);
      expect(user.getCompletedTasks()).toBe(2);
    });

    test("should return 0 when no tasks are completed", () => {
      user.addTask(task2);
      expect(user.getCompletedTasks()).toBe(0);
    });
  });

  describe("getPendingTasks() method", () => {
    test("should return correct number of pending tasks", () => {
      user.addTask(task1);
      user.addTask(task2);
      user.addTask(task3);
      expect(user.getPendingTasks()).toBe(1);
    });
  });

  describe("getTasksByStatus() method", () => {
    beforeEach(() => {
      user.addTask(task1);
      user.addTask(task2);
      user.addTask(task3);
    });

    test("should filter tasks by completed status", () => {
      const completedTasks = user.getTasksByStatus("Completed");
      expect(completedTasks).toHaveLength(2);
      expect(completedTasks[0].completed).toBe(true);
    });

    test("should filter tasks by pending status", () => {
      const pendingTasks = user.getTasksByStatus("Pending");
      expect(pendingTasks).toHaveLength(1);
      expect(pendingTasks[0].completed).toBe(false);
    });

    test("should handle case-insensitive status input", () => {
      const completedTasks = user.getTasksByStatus("COMPLETED");
      expect(completedTasks).toHaveLength(2);
    });

    test("should return empty array for invalid status", () => {
      const invalidTasks = user.getTasksByStatus("Invalid");
      expect(invalidTasks).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    test("should handle null tasks gracefully", () => {
      user.addTask(null);
      expect(user.tasks).toContain(null);
      expect(user.getCompletionRate()).toBe(0);
    });

    test("should handle undefined tasks", () => {
      user.addTask(undefined);
      expect(user.tasks).toContain(undefined);
    });
  });
});

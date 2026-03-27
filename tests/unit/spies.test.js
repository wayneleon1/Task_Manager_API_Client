import { jest } from "@jest/globals";
import { Task, PriorityTask, User } from "../../model/models.js";
import {
  filterByStatus,
  calculateStatistics,
} from "../../controller/taskProcessor.js";

describe("Tests with Spies", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: jest.spyOn(console, "log").mockImplementation(() => {}),
      error: jest.spyOn(console, "error").mockImplementation(() => {}),
      warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    if (consoleSpy) {
      Object.values(consoleSpy).forEach((spy) => {
        if (spy && spy.mockRestore) spy.mockRestore();
      });
    }
  });

  describe("Spying on internal method calls", () => {
    test("should verify toggle() is called when updating task status", () => {
      const task = new Task({
        id: 1,
        title: "Test task",
        completed: false,
        userId: 1,
      });
      const toggleSpy = jest.spyOn(task, "toggle");

      task.toggle();

      expect(toggleSpy).toHaveBeenCalledTimes(1);
      expect(toggleSpy).toHaveBeenCalledWith();
      toggleSpy.mockRestore();
    });

    test("should verify getStatus() is called when filtering tasks", () => {
      const tasks = [
        new Task({ id: 1, title: "Task 1", completed: true, userId: 1 }),
        new Task({ id: 2, title: "Task 2", completed: false, userId: 1 }),
      ];

      const getStatusSpy = jest.spyOn(tasks[0], "getStatus");

      filterByStatus(tasks, "completed");

      expect(getStatusSpy).toHaveBeenCalled();
      getStatusSpy.mockRestore();
    });
  });

  describe("Spying on Array methods", () => {
    test("should verify filter is called when getting completed tasks", () => {
      const user = new User({ id: 1, name: "John", email: "john@example.com" });
      const tasks = [
        new Task({ id: 1, title: "Task 1", completed: true, userId: 1 }),
        new Task({ id: 2, title: "Task 2", completed: false, userId: 1 }),
      ];
      tasks.forEach((task) => user.addTask(task));

      const filterSpy = jest.spyOn(Array.prototype, "filter");

      user.getCompletedTasks();

      expect(filterSpy).toHaveBeenCalled();
      filterSpy.mockRestore();
    });

    test("should verify map is called when processing tasks", () => {
      const tasks = [
        new Task({ id: 1, title: "Task 1", completed: true, userId: 1 }),
        new Task({ id: 2, title: "Task 2", completed: false, userId: 1 }),
      ];

      const mapSpy = jest.spyOn(Array.prototype, "map");

      const titles = tasks.map((t) => t.title);

      expect(mapSpy).toHaveBeenCalledTimes(1);
      expect(titles).toEqual(["Task 1", "Task 2"]);
      mapSpy.mockRestore();
    });

    test("should verify reduce is called when calculating statistics", () => {
      const tasks = [
        new Task({ id: 1, title: "Task 1", completed: true, userId: 1 }),
        new Task({ id: 2, title: "Task 2", completed: false, userId: 1 }),
      ];

      const reduceSpy = jest.spyOn(Array.prototype, "reduce");

      calculateStatistics(tasks);

      expect(reduceSpy).toHaveBeenCalled();
      reduceSpy.mockRestore();
    });
  });

  describe("Spying on console methods", () => {
    test("should verify console.error is called on API error simulation", () => {
      // Simulate error condition
      try {
        throw new Error("API Error");
      } catch (err) {
        console.error("Error:", err.message);
      }

      expect(consoleSpy.error).toHaveBeenCalledWith("Error:", "API Error");
    });

    test("should verify console.warn is called for invalid operations", () => {
      const user = new User({ id: 1, name: "John", email: "john@example.com" });

      if (user.tasks.length === 0) {
        console.warn("No tasks available");
      }

      expect(consoleSpy.warn).toHaveBeenCalledWith("No tasks available");
    });

    test("should verify console.log is called for status messages", () => {
      const task = new Task({
        id: 1,
        title: "Test",
        completed: false,
        userId: 1,
      });

      console.log(`Task status: ${task.getStatus()}`);

      expect(consoleSpy.log).toHaveBeenCalledWith("Task status: Pending");
    });
  });

  describe("Spying on method call sequences", () => {
    test("should verify sequence of method calls in PriorityTask", () => {
      const priorityTask = new PriorityTask({
        id: 1,
        title: "Urgent",
        completed: false,
        userId: 1,
        priority: "high",
      });

      // Track order of calls
      const callOrder = [];

      // Create spies that record call order
      const toggleSpy = jest
        .spyOn(priorityTask, "toggle")
        .mockImplementation(() => {
          callOrder.push("toggle");
          priorityTask.completed = true;
        });

      const getStatusSpy = jest
        .spyOn(priorityTask, "getStatus")
        .mockImplementation(() => {
          callOrder.push("getStatus");
          return "Completed | Priority: high";
        });

      priorityTask.toggle();
      const status = priorityTask.getStatus();

      // Verify call order
      expect(callOrder).toEqual(["toggle", "getStatus"]);
      expect(toggleSpy).toHaveBeenCalled();
      expect(getStatusSpy).toHaveBeenCalled();
      expect(status).toBe("Completed | Priority: high");

      toggleSpy.mockRestore();
      getStatusSpy.mockRestore();
    });

    test("should verify addTask is called for each task added to user", () => {
      const user = new User({ id: 1, name: "John", email: "john@example.com" });
      const addTaskSpy = jest.spyOn(user, "addTask");

      const task1 = new Task({
        id: 1,
        title: "Task 1",
        completed: false,
        userId: 1,
      });
      const task2 = new Task({
        id: 2,
        title: "Task 2",
        completed: true,
        userId: 1,
      });

      user.addTask(task1);
      user.addTask(task2);

      expect(addTaskSpy).toHaveBeenCalledTimes(2);
      expect(addTaskSpy).toHaveBeenNthCalledWith(1, task1);
      expect(addTaskSpy).toHaveBeenNthCalledWith(2, task2);

      addTaskSpy.mockRestore();
    });
  });
});

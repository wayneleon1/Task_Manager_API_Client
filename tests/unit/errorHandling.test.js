import { Task, PriorityTask, User } from "../../model/models.js";

describe("Error Handling Tests", () => {
  describe("Task Class Error Scenarios", () => {
    test("should handle undefined constructor arguments", () => {
      const task = new Task();
      expect(task.id).toBeUndefined();
      expect(task.title).toBeUndefined();
      expect(task.completed).toBeUndefined();
    });

    test("should handle invalid toggle operations", () => {
      const task = new Task({
        id: 1,
        title: "Test",
        completed: false,
        userId: 1,
      });
      expect(() => task.toggle()).not.toThrow();
    });

    test("should handle non-boolean completion values", () => {
      const task = new Task({
        id: 1,
        title: "Test",
        completed: "invalid",
        userId: 1,
      });
      expect(task.completed).toBe("invalid");
      // Since 'invalid' is truthy, getStatus returns 'Completed'
      expect(task.getStatus()).toBe("Completed");
    });
  });

  describe("PriorityTask Class Error Scenarios", () => {
    test("should handle invalid priority values", () => {
      const task = new PriorityTask({
        id: 1,
        title: "Test",
        completed: false,
        userId: 1,
        priority: "invalid",
      });
      expect(task.priority).toBe("invalid");
    });

    test("should handle null dueDate", () => {
      const task = new PriorityTask({
        id: 1,
        title: "Test",
        completed: false,
        userId: 1,
        dueDate: null,
      });
      expect(task.dueDate).toBeNull();
    });
  });

  describe("User Class Error Scenarios", () => {
    test("should handle division by zero in completion rate", () => {
      const user = new User({ id: 1, name: "John", email: "john@example.com" });
      expect(user.getCompletionRate()).toBe(0);
    });

    test("should handle adding null tasks", () => {
      const user = new User({ id: 1, name: "John", email: "john@example.com" });
      expect(() => user.addTask(null)).not.toThrow();
      expect(user.tasks).toContain(null);
      // getCompletionRate should handle null tasks gracefully
      expect(user.getCompletionRate()).toBe(0);
    });

    test("should handle invalid status in getTasksByStatus", () => {
      const user = new User({ id: 1, name: "John", email: "john@example.com" });
      const task = new Task({
        id: 1,
        title: "Test",
        completed: true,
        userId: 1,
      });
      user.addTask(task);

      const results = user.getTasksByStatus("Invalid");
      expect(results).toEqual([]);
    });
  });

  describe("Boundary Conditions", () => {
    test("should handle extremely large task arrays", () => {
      const user = new User({ id: 1, name: "John", email: "john@example.com" });
      for (let i = 0; i < 1000; i++) {
        user.addTask(
          new Task({
            id: i,
            title: `Task ${i}`,
            completed: i % 2 === 0,
            userId: 1,
          }),
        );
      }
      expect(user.getCompletionRate()).toBe(50);
      expect(user.getCompletedTasks()).toBe(500);
    });

    test("should handle very long task titles", () => {
      const longTitle = "A".repeat(1000);
      const task = new Task({
        id: 1,
        title: longTitle,
        completed: false,
        userId: 1,
      });
      expect(task.title).toBe(longTitle);
      expect(task.title.length).toBe(1000);
    });
  });
});

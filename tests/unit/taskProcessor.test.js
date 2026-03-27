import {
  filterByStatus,
  calculateStatistics,
  groupByUser,
} from "../../controller/taskProcessor.js";
import { Task } from "../../model/models.js";

describe("Task Processor Functions", () => {
  let tasks;

  beforeEach(() => {
    tasks = [
      new Task({ id: 1, title: "Task 1", completed: true, userId: 1 }),
      new Task({ id: 2, title: "Task 2", completed: false, userId: 1 }),
      new Task({ id: 3, title: "Task 3", completed: true, userId: 2 }),
      new Task({ id: 4, title: "Task 4", completed: false, userId: 2 }),
      new Task({ id: 5, title: "Task 5", completed: false, userId: 3 }),
    ];
  });

  describe("filterByStatus()", () => {
    test("should filter tasks by pending status", () => {
      const pendingTasks = filterByStatus(tasks, "pending");
      expect(pendingTasks).toHaveLength(3);
      expect(pendingTasks.every((task) => !task.completed)).toBe(true);
    });

    test("should filter tasks by completed status", () => {
      const completedTasks = filterByStatus(tasks, "completed");
      expect(completedTasks).toHaveLength(2);
      expect(completedTasks.every((task) => task.completed)).toBe(true);
    });

    test("should return empty array when no tasks match status", () => {
      const noMatchTasks = filterByStatus(tasks, "invalid");
      expect(noMatchTasks).toHaveLength(0);
    });

    test("should handle empty array input", () => {
      const emptyResult = filterByStatus([], "pending");
      expect(emptyResult).toHaveLength(0);
    });

    test("should handle null input", () => {
      const nullResult = filterByStatus(null, "pending");
      expect(nullResult).toEqual([]);
    });

    test("should handle undefined tasks array", () => {
      const undefinedResult = filterByStatus(undefined, "pending");
      expect(undefinedResult).toEqual([]);
    });
  });

  describe("calculateStatistics()", () => {
    test("should calculate correct statistics for tasks", () => {
      const stats = calculateStatistics(tasks);
      expect(stats).toEqual({
        total: 5,
        completed: 2,
      });
    });

    test("should handle empty tasks array", () => {
      const stats = calculateStatistics([]);
      expect(stats).toEqual({
        total: 0,
        completed: 0,
      });
    });

    test("should handle tasks with all completed", () => {
      const allCompleted = tasks.map((t) => {
        t.completed = true;
        return t;
      });
      const stats = calculateStatistics(allCompleted);
      expect(stats).toEqual({
        total: 5,
        completed: 5,
      });
    });

    test("should handle tasks with none completed", () => {
      const noneCompleted = tasks.map((t) => {
        t.completed = false;
        return t;
      });
      const stats = calculateStatistics(noneCompleted);
      expect(stats).toEqual({
        total: 5,
        completed: 0,
      });
    });

    test("should handle null tasks array", () => {
      const stats = calculateStatistics(null);
      expect(stats).toEqual({ total: 0, completed: 0 });
    });
  });

  describe("groupByUser()", () => {
    test("should group tasks by userId", () => {
      const grouped = groupByUser(tasks);
      expect(grouped.size).toBe(3);
      expect(grouped.get(1)).toHaveLength(2);
      expect(grouped.get(2)).toHaveLength(2);
      expect(grouped.get(3)).toHaveLength(1);
    });

    test("should return empty Map for empty tasks array", () => {
      const grouped = groupByUser([]);
      expect(grouped.size).toBe(0);
    });

    test("should handle tasks with same userId", () => {
      const sameUserTasks = [
        new Task({ id: 1, title: "Task 1", completed: true, userId: 1 }),
        new Task({ id: 2, title: "Task 2", completed: false, userId: 1 }),
      ];
      const grouped = groupByUser(sameUserTasks);
      expect(grouped.size).toBe(1);
      expect(grouped.get(1)).toHaveLength(2);
    });

    test("should preserve task order within groups", () => {
      const grouped = groupByUser(tasks);
      const user1Tasks = grouped.get(1);
      expect(user1Tasks[0].id).toBe(1);
      expect(user1Tasks[1].id).toBe(2);
    });

    test("should handle null input", () => {
      const grouped = groupByUser(null);
      expect(grouped).toEqual(new Map());
    });
  });
});

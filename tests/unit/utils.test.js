import { Task } from "../../model/models.js";

describe("Array Manipulation and Search Functions", () => {
  let tasks;

  beforeEach(() => {
    tasks = [
      new Task({
        id: 1,
        title: "Complete project",
        completed: false,
        userId: 1,
      }),
      new Task({ id: 2, title: "Review code", completed: true, userId: 1 }),
      new Task({ id: 3, title: "Write tests", completed: false, userId: 2 }),
      new Task({
        id: 4,
        title: "Deploy application",
        completed: false,
        userId: 1,
      }),
      new Task({ id: 5, title: "Fix bugs", completed: true, userId: 2 }),
    ];
  });

  describe("filterByProperty() - Custom filter function", () => {
    const filterByProperty = (items, property, value) => {
      return items.filter((item) => item[property] === value);
    };

    test("should filter items by property value", () => {
      const userId1Tasks = filterByProperty(tasks, "userId", 1);
      expect(userId1Tasks).toHaveLength(3);
      expect(userId1Tasks.every((task) => task.userId === 1)).toBe(true);
    });

    test("should return empty array when no matches found", () => {
      const noMatches = filterByProperty(tasks, "userId", 999);
      expect(noMatches).toHaveLength(0);
    });

    test("should handle empty array", () => {
      const emptyResult = filterByProperty([], "userId", 1);
      expect(emptyResult).toHaveLength(0);
    });
  });

  describe("searchByProperty() - Search function", () => {
    const searchByProperty = (items, property, searchTerm) => {
      return items.filter((item) =>
        String(item[property]).toLowerCase().includes(searchTerm.toLowerCase()),
      );
    };

    test("should search tasks by title keyword", () => {
      const results = searchByProperty(tasks, "title", "code");
      expect(results).toHaveLength(1);
      expect(results[0].title).toContain("code");
    });

    test("should return multiple matches for common keywords", () => {
      const results = searchByProperty(tasks, "title", "project");
      expect(results).toHaveLength(1);
    });

    test("should handle case-insensitive search", () => {
      const results = searchByProperty(tasks, "title", "CODE");
      expect(results).toHaveLength(1);
    });

    test("should return empty array for no matches", () => {
      const results = searchByProperty(tasks, "title", "nonexistent");
      expect(results).toHaveLength(0);
    });

    test("should handle empty search term", () => {
      const results = searchByProperty(tasks, "title", "");
      expect(results).toHaveLength(5);
    });
  });

  describe("sortBy() - Sorting function", () => {
    const sortBy = (items, property, order = "asc") => {
      const sorted = [...items];
      sorted.sort((a, b) => {
        if (a[property] < b[property]) return order === "asc" ? -1 : 1;
        if (a[property] > b[property]) return order === "asc" ? 1 : -1;
        return 0;
      });
      return sorted;
    };

    test("should sort tasks by id in ascending order", () => {
      const sorted = sortBy(tasks, "id", "asc");
      expect(sorted[0].id).toBe(1);
      expect(sorted[4].id).toBe(5);
    });

    test("should sort tasks by id in descending order", () => {
      const sorted = sortBy(tasks, "id", "desc");
      expect(sorted[0].id).toBe(5);
      expect(sorted[4].id).toBe(1);
    });

    test("should not mutate original array", () => {
      const originalIds = tasks.map((t) => t.id);
      sortBy(tasks, "id");
      const currentIds = tasks.map((t) => t.id);
      expect(currentIds).toEqual(originalIds);
    });
  });

  describe("reduceOperations() - Aggregation functions", () => {
    const getTaskCountByUser = (tasks) => {
      return tasks.reduce((acc, task) => {
        acc[task.userId] = (acc[task.userId] || 0) + 1;
        return acc;
      }, {});
    };

    test("should count tasks per user", () => {
      const counts = getTaskCountByUser(tasks);
      expect(counts).toEqual({
        1: 3,
        2: 2,
      });
    });

    test("should handle empty array", () => {
      const counts = getTaskCountByUser([]);
      expect(counts).toEqual({});
    });
  });
});

import { jest } from "@jest/globals";
import { APIClient } from "../../api/api.js";
import { Task, User } from "../../model/models.js";
import {
  filterByStatus,
  calculateStatistics,
  groupByUser,
} from "../../controller/taskProcessor.js";

// Mock the API client
jest.mock("../../api/api.js");

describe("Complete Data Flow Integration Tests", () => {
  let apiClient;
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];

  const mockTodos = [
    { id: 1, title: "Complete project", completed: false, userId: 1 },
    { id: 2, title: "Review code", completed: true, userId: 1 },
    { id: 3, title: "Write tests", completed: false, userId: 2 },
    { id: 4, title: "Deploy application", completed: false, userId: 1 },
  ];

  beforeEach(() => {
    apiClient = new APIClient();
    apiClient.fetchUsers = jest.fn().mockResolvedValue(mockUsers);
    apiClient.fetchTodos = jest.fn().mockResolvedValue(mockTodos);
  });

  describe("Workflow 1: Fetch users and todos, create models, and calculate statistics", () => {
    test("should fetch data, create models, and calculate completion rate", async () => {
      // Fetch data
      const usersData = await apiClient.fetchUsers();
      const todosData = await apiClient.fetchTodos();

      // Create model instances
      const users = usersData.map((u) => new User(u));
      const tasks = todosData.map((t) => new Task(t));

      // Assign tasks to users
      tasks.forEach((task) => {
        const user = users.find((u) => u.id === task.userId);
        if (user) user.addTask(task);
      });

      // Calculate statistics
      const stats = calculateStatistics(tasks);

      // Assertions
      expect(users).toHaveLength(2);
      expect(tasks).toHaveLength(4);
      expect(stats.total).toBe(4);
      expect(stats.completed).toBe(1);

      // Verify user tasks
      const user1 = users.find((u) => u.id === 1);
      expect(user1.tasks).toHaveLength(3);
      expect(user1.getCompletionRate()).toBe(33.33333333333333);

      const user2 = users.find((u) => u.id === 2);
      expect(user2.tasks).toHaveLength(1);
      expect(user2.getCompletionRate()).toBe(0);
    });
  });

  describe("Workflow 2: Filter tasks by status and group by user", () => {
    test("should fetch data, filter pending tasks, and group by user", async () => {
      // Fetch data
      const todosData = await apiClient.fetchTodos();
      const tasks = todosData.map((t) => new Task(t));

      // Filter pending tasks
      const pendingTasks = filterByStatus(tasks, "pending");

      // Group by user
      const groupedByUser = groupByUser(pendingTasks);

      // Assertions
      expect(pendingTasks).toHaveLength(3);
      expect(groupedByUser.size).toBe(2);
      expect(groupedByUser.get(1)).toHaveLength(2);
      expect(groupedByUser.get(2)).toHaveLength(1);
    });
  });

  describe("Workflow 3: User-specific task management", () => {
    test("should fetch user todos and calculate user statistics", async () => {
      // Mock fetchUserTodos for specific user
      const user1Todos = mockTodos.filter((t) => t.userId === 1);
      apiClient.fetchUserTodos = jest.fn().mockResolvedValue(user1Todos);

      // Fetch user-specific todos
      const userTodos = await apiClient.fetchUserTodos(1);

      // Create User model
      const user = new User(mockUsers[0]);

      // Create Task models and add to user
      const tasks = userTodos.map((t) => new Task(t));
      tasks.forEach((task) => user.addTask(task));

      // Calculate user statistics
      const completionRate = user.getCompletionRate();
      const completedTasks = user.getCompletedTasks();
      const pendingTasks = user.getPendingTasks();

      // Assertions
      expect(tasks).toHaveLength(3);
      expect(completionRate).toBe(33.33333333333333);
      expect(completedTasks).toBe(1);
      expect(pendingTasks).toBe(2);
      expect(apiClient.fetchUserTodos).toHaveBeenCalledWith(1);
    });
  });

  describe("Workflow 4: Error handling in data flow", () => {
    test("should handle API failure gracefully", async () => {
      apiClient.fetchUsers = jest
        .fn()
        .mockRejectedValue(new Error("API Error"));

      const usersData = await apiClient.fetchUsers().catch((e) => null);
      const todosData = await apiClient.fetchTodos();

      const users = usersData ? usersData.map((u) => new User(u)) : [];
      const tasks = todosData.map((t) => new Task(t));

      expect(users).toHaveLength(0);
      expect(tasks).toHaveLength(4);
    });
  });
});

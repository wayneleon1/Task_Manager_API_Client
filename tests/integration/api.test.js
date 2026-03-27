import { APIClient } from "../../api/api.js";

// Mock fetch globally
global.fetch = jest.fn();

describe("APIClient Integration Tests", () => {
  let apiClient;
  const baseURL = "https://jsonplaceholder.typicode.com";

  beforeEach(() => {
    apiClient = new APIClient(baseURL);
    jest.clearAllMocks();
  });

  describe("fetchUsers()", () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ];

    test("should fetch users successfully", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

      const users = await apiClient.fetchUsers();
      expect(users).toEqual(mockUsers);
      expect(fetch).toHaveBeenCalledWith(`${baseURL}/users`);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("should handle network failure", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const users = await apiClient.fetchUsers();
      expect(users).toEqual([]);
      expect(fetch).toHaveBeenCalledWith(`${baseURL}/users`);
    });

    test("should handle non-OK response", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const users = await apiClient.fetchUsers();
      expect(users).toEqual([]);
    });
  });

  describe("fetchTodos()", () => {
    const mockTodos = [
      { id: 1, title: "Task 1", completed: false, userId: 1 },
      { id: 2, title: "Task 2", completed: true, userId: 1 },
    ];

    test("should fetch todos successfully", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      });

      const todos = await apiClient.fetchTodos();
      expect(todos).toEqual(mockTodos);
      expect(fetch).toHaveBeenCalledWith(`${baseURL}/todos`);
    });

    test("should handle 500 server error", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const todos = await apiClient.fetchTodos();
      expect(todos).toEqual([]);
    });
  });

  describe("fetchUserTodos()", () => {
    const mockUserTodos = [
      { id: 1, title: "User task 1", completed: false, userId: 1 },
      { id: 2, title: "User task 2", completed: true, userId: 1 },
    ];

    test("should fetch user todos successfully", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserTodos,
      });

      const todos = await apiClient.fetchUserTodos(1);
      expect(todos).toEqual(mockUserTodos);
      expect(fetch).toHaveBeenCalledWith(`${baseURL}/users/1/todos`);
    });

    test("should handle empty user todos", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const todos = await apiClient.fetchUserTodos(999);
      expect(todos).toEqual([]);
    });

    test("should handle invalid user ID", async () => {
      fetch.mockRejectedValueOnce(new Error("Invalid user ID"));

      const todos = await apiClient.fetchUserTodos("invalid");
      expect(todos).toEqual([]);
    });
  });

  describe("Error Handling", () => {
    test("should handle timeout errors", async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error("Timeout")));

      const users = await apiClient.fetchUsers();
      expect(users).toEqual([]);
    });

    test("should handle malformed JSON response", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const users = await apiClient.fetchUsers();
      expect(users).toEqual([]);
    });
  });
});

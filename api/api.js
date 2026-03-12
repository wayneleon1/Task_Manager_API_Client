export class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchUsers() {
    try {
      const response = await fetch(`${this.baseURL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Network error or invalid URL:", error);
      } else {
        console.error("Error fetching users:", error);
      }
      throw error;
    }
  }

  async fetchTodos() {
    try {
      const response = await fetch(`${this.baseURL}/todos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Network error or invalid URL:", error);
      } else {
        console.error("Error fetching todos:", error);
      }

      throw error;
    }
  }

  async fetchUserTodos(userId) {
    try {
      const response = await fetch(`${this.baseURL}/todos?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Network error or invalid URL:", error);
      } else {
        console.error(`Error fetching todos for user ${userId}:`, error);
      }
      throw error;
    }
  }
}

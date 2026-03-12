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
      console.error("Error fetching users:", error);
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
      console.error("Error fetching todos:", error);
      throw error;
    }
  }
}

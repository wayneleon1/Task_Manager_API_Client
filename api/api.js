export class APIClient {
  constructor(baseURL = "https://jsonplaceholder.typicode.com") {
    this.baseURL = baseURL;
  }

  async fetchUsers() {
    try {
      const res = await fetch(`${this.baseURL}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    } catch (err) {
      console.error("Error fetching users:", err.message);
      return [];
    }
  }

  async fetchTodos() {
    try {
      const res = await fetch(`${this.baseURL}/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      return res.json();
    } catch (err) {
      console.error("Error fetching todos:", err.message);
      return [];
    }
  }

  async fetchUserTodos(userId) {
    try {
      const res = await fetch(`${this.baseURL}/users/${userId}/todos`);
      if (!res.ok) throw new Error("Failed to fetch user todos");
      return res.json();
    } catch (err) {
      console.error("Error fetching user todos:", err.message);
      return [];
    }
  }
}

export class APIClient {
  constructor(baseURL = "https://jsonplaceholder.typicode.com") {
    this.baseURL = baseURL;
  }

  async fetchUsers() {
    return [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ];
  }

  async fetchTodos() {
    return [
      { id: 1, title: "Complete project", completed: false, userId: 1 },
      { id: 2, title: "Review code", completed: true, userId: 1 },
      { id: 3, title: "Write tests", completed: false, userId: 2 },
      { id: 4, title: "Deploy application", completed: false, userId: 1 },
      { id: 5, title: "Fix bugs", completed: true, userId: 2 },
    ];
  }

  async fetchUserTodos(userId) {
    const allTodos = await this.fetchTodos();
    return allTodos.filter((todo) => todo.userId === parseInt(userId));
  }
}

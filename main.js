import { APIClient } from "./api.js";

async function main() {
  const apiClient = new APIClient("https://jsonplaceholder.typicode.com");
  try {
    const users = await apiClient.fetchUsers();
    const todos = await apiClient.fetchTodos();
    console.log("Users:", users);
    console.log("Todos:", todos);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}

main();

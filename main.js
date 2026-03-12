import { APIClient } from "./api/api.js";

async function main() {
  const apiClient = new APIClient("https://jsonplaceholder.typicode.com");
  try {
    const [users, todos] = await Promise.all([
      apiClient.fetchUsers(),
      apiClient.fetchTodos(),
    ]);

    console.log("Users:", users);
    console.log("Todos:", todos);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}

main();

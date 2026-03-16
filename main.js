import { APIClient } from "./api/api.js";
import { Task, User } from "./model/models.js";
import * as processor from "./controller/taskProcessor.js";
import readline from "readline";

const api = new APIClient();
let users = [];
let tasks = [];

// CLI setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log(`
=== Task Manager CLI ===
1. Show all users
2. Show user statistics
3. Show all tasks
4. Show pending tasks
5. Exit
`);
  rl.question("Choose an option: ", handleMenu);
}

function handleMenu(choice) {
  switch (choice.trim()) {
    case "1":
      users.forEach((u) => console.log(`- ${u.name} (${u.email})`));
      break;
    case "2":
      users.forEach((u) => {
        console.log(`\nUser: ${u.name}`);
        console.log(`Completion Rate: ${u.getCompletionRate().toFixed(2)}%`);
      });
      break;
    case "3":
      tasks
        .slice(0, 10)
        .forEach((t) => console.log(`- ${t.title} [${t.getStatus()}]`));
      break;
    case "4":
      const pending = processor.filterByStatus(tasks, "pending");
      console.log(`Pending Tasks (${pending.length}):`);
      pending
        .slice(0, 10)
        .forEach((t) => console.log(`- ${t.title} (User ${t.userId})`));
      break;
    case "5":
      console.log("Goodbye!");
      rl.close();
      return;
    default:
      console.log("Invalid choice, try again.");
  }
  showMenu();
}

async function run() {
  console.log("Fetching data...");
  const [usersData, todosData] = await Promise.all([
    api.fetchUsers(),
    api.fetchTodos(),
  ]);

  users = usersData.map((u) => new User(u));
  tasks = todosData.map((t) => new Task(t));

  tasks.forEach((task) => {
    const user = users.find((u) => u.id === task.userId);
    if (user) user.addTask(task);
  });

  showMenu();
}

run();

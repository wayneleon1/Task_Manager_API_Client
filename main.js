import { APIClient } from "./api/api.js";
import { Task, User } from "./model/models.js";
import * as processor from "./controller/taskProcessor.js";
import readline from "readline";

const api = new APIClient();
let users = [];
let tasks = [];

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
5. Fetch tasks for a specific user (API call)
6. Show tasks by status (Completed/Pending) from local cache
7. Group tasks by user (Map)
8. Extract unique tags/categories (Set)
9. Search tasks by keyword
10. Show aggregated statistics
11. Exit
`);
  rl.question("Choose an option: ", handleMenu);
}

async function handleMenu(choice) {
  switch (choice.trim()) {
    case "1":
      users.forEach((u) => console.log(`- ${u.name} (${u.email})`));
      break;

    case "2":
      users.forEach((u) => {
        console.log(`\nUser: ${u.name}`);
        console.log(`Total Tasks: ${u.tasks.length}`);
        console.log(`Completed Tasks: ${u.getCompletedTasks()}`);
        console.log(`Pending Tasks: ${u.getPendingTasks()}`);
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
      rl.question("Enter user ID: ", async (id) => {
        const userTodos = await api.fetchUserTodos(id);
        if (userTodos.length === 0) {
          console.log("No tasks found or error fetching.");
        } else {
          console.log(`Tasks for User ${id}:`);
          userTodos
            .slice(0, 10)
            .forEach((t) =>
              console.log(
                `- ${t.title} [${t.completed ? "Completed" : "Pending"}]`,
              ),
            );
        }
        showMenu();
      });
      return;

    case "6":
      rl.question("Enter status (Completed/Pending): ", (status) => {
        users.forEach((u) => {
          const filtered = u.getTasksByStatus(status);
          if (filtered.length > 0) {
            console.log(`\n${u.name}'s tasks (${status}):`);
            filtered
              .slice(0, 5)
              .forEach((t) => console.log(`- ${t.title} [${t.getStatus()}]`));
          }
        });
        showMenu();
      });
      return;

    case "7":
      const grouped = processor.groupByUser(tasks);
      grouped.forEach((userTasks, userId) => {
        console.log(`\nUser ${userId} has ${userTasks.length} tasks`);
      });
      break;

    case "8":
      const tags = new Set(tasks.map((t) => t.title.split(" ")[0]));
      console.log("Unique tags/categories:");
      console.log([...tags].slice(0, 20).join(", "));
      break;

    case "9":
      rl.question("Enter keyword to search: ", (keyword) => {
        const results = tasks.filter((t) =>
          t.title.toLowerCase().includes(keyword.toLowerCase()),
        );
        console.log(`Found ${results.length} tasks with "${keyword}":`);
        results
          .slice(0, 10)
          .forEach((t) => console.log(`- ${t.title} [${t.getStatus()}]`));
        showMenu();
      });
      return;

    case "10":
      const { total, completed } = processor.calculateStatistics(tasks);
      console.log(`
          === Aggregated Statistics ===
          Total tasks: ${total}
          Completed: ${completed}
          Pending: ${total - completed}
          Completion Rate: ${((completed / total) * 100).toFixed(2)}%
          `);
      break;

    case "11":
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

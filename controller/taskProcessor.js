export const filterByStatus = (tasks, status) => {
  return tasks.filter((task) => Task.getStatus(task) === status);
};

export const calculateStatistics = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter((task) => Task.isOverdue(task)).length;
  return { total, completed, pending, overdue };
};

export const groupByUser = (tasks) => {
  return tasks.reduce((acc, task) => {
    const userId = Task.getUserId(task);
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(task);
    return acc;
  }, {});
};

export const filterByPriority = (tasks, priority) => {
  return tasks.filter((task) => task.priority && task.priority === priority);
};

export const searchTasks = (tasks, searchTerm) => {
  if (!searchTerm) return tasks;
  const term = searchTerm.toLowerCase();
  return tasks.filter((task) => task.title.toLowerCase().includes(term));
};

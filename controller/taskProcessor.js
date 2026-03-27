export const filterByStatus = (tasks, status) => {
  if (!tasks || !Array.isArray(tasks)) return [];
  return tasks.filter(
    (t) => t && t.getStatus().toLowerCase().includes(status.toLowerCase()),
  );
};

export const calculateStatistics = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return { total: 0, completed: 0 };
  return tasks.reduce(
    (stats, task) => {
      stats.total++;
      if (task && task.completed) stats.completed++;
      return stats;
    },
    { total: 0, completed: 0 },
  );
};

export const groupByUser = (tasks) => {
  if (!tasks || !Array.isArray(tasks)) return new Map();
  const map = new Map();
  tasks.forEach((task) => {
    if (task && task.userId) {
      if (!map.has(task.userId)) map.set(task.userId, []);
      map.get(task.userId).push(task);
    }
  });
  return map;
};

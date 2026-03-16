export const filterByStatus = (tasks, status) =>
  tasks.filter((t) =>
    t.getStatus().toLowerCase().includes(status.toLowerCase()),
  );

export const calculateStatistics = (tasks) =>
  tasks.reduce(
    (stats, task) => {
      stats.total++;
      if (task.completed) stats.completed++;
      return stats;
    },
    { total: 0, completed: 0 },
  );

export const groupByUser = (tasks) => {
  const map = new Map();
  tasks.forEach((task) => {
    if (!map.has(task.userId)) map.set(task.userId, []);
    map.get(task.userId).push(task);
  });
  return map;
};

import { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("/data/tasks.json");
      const data = await response.json();
      setTasks(data);
    }

    fetchTasks();
  }, []);

  function addTask(title) {
    const newTask = { id: Date.now(), title, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

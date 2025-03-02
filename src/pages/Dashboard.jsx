import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTask } from "../hooks/useTask";

function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, addTask, toggleTask, deleteTask } = useTask();
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState("");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleAddTask() {
    if (newTask.trim() === "") return;
    addTask(newTask);
    setNewTask("");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user?.email}!</p>
      <button onClick={handleLogout}>Sair</button>

      <h2>Suas Tarefas</h2>

      <input
        type="text"
        placeholder="Nova tarefa"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Adicionar</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

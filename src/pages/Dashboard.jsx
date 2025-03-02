import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTask } from "../hooks/useTask";

function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, addTask, toggleTask, deleteTask } = useTask();
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleAddTask() {
    if (newTask.trim() === "") return;
    addTask(newTask);
    setNewTask("");
    setMessage("Tarefa adicionada com sucesso!");
    setError("");
  }

  function handleDeleteTask(id) {
    deleteTask(id);
    setMessage("Tarefa excluída com sucesso!");
    setError("");
  }

  // Simula o carregamento de tarefas
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/data/tasks.json");
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError("Erro ao carregar tarefas!");
    }
  };

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

      {/* Mensagens de sucesso ou erro */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Indicador de carregamento */}
      {loading ? (
        <p>Carregando tarefas...</p>
      ) : (
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
              <button onClick={() => handleDeleteTask(task.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/data/tasks.json"); // Simulando API externa
        if (!response.ok) throw new Error("Erro ao carregar tarefas");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user?.email}!</p>
      <button onClick={handleLogout}>Sair</button>

      <h2>Suas Tarefas</h2>

      {loading && <p>Carregando tarefas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} {task.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

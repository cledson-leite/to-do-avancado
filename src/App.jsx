import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./styles/styles.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Login />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

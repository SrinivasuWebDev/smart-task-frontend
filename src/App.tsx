// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TaskDashboard from "./components/TaskDashboard/TaskDashboard";
import Register from "./auth/Register";
import Login from "./auth/Login";
import AdminDashboard from "./Admin/AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<TaskDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

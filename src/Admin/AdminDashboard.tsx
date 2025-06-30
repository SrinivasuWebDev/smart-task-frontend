import { useEffect, useState } from "react";
import api from "../api/taskApi";

type UserType = {
  id: number;
  username: string;
  role: string;
  active: boolean;
};

type TaskType = {
  id: number;
  name: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
  user: {
    username: string;
  };
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [message, setMessage] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      setMessage("Failed to fetch users.");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/admin/all-tasks");
      setTasks(res.data);
    } catch {
      setMessage("Failed to fetch tasks.");
    }
  };

  const toggleStatus = async (userId: number) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle`);
      setMessage(res.data.message);
      fetchUsers();
    } catch {
      setMessage("Status update failed.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
      });
      setMessage(res.data.message || "User created");
      setNewUser({ username: "", password: "", role: "USER" });
      fetchUsers();
    } catch {
      setMessage("Failed to create user.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mt-5">
      {/* <h3 className="mb-4">Admin Dashboard</h3> */}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
  <h3 className="mb-0">Admin: {localStorage.getItem("username")}</h3>
  <button
    className="btn btn-outline-secondary"
    onClick={() => {
      localStorage.clear();
      window.location.href = "/login"; // Update this path if needed
    }}
  >
    Logout
  </button>
</div>


      {message && (
        <div
          className="alert alert-info position-fixed top-0 start-50 translate-middle-x"
          style={{ zIndex: 1000 }}
        >
          {message}
        </div>
      )}

      {/* New User/Admin Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Create New User or Admin</h5>
        <form onSubmit={handleCreateUser}>
          <div className="row">
            <div className="col-md-4 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-4 mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-2 mb-2">
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="col-md-2 mb-2">
              <button type="submit" className="btn btn-primary w-100">
                Create
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <h5 className="mt-4">All Users</h5>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id}>
              <td>{index + 1}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.active ? "Active" : "Deactivated"}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    u.active ? "btn-danger" : "btn-success"
                  }`}
                  onClick={() => toggleStatus(u.id)}
                >
                  {u.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tasks Table */}
      <h5 className="mt-5">All Tasks by Users</h5>
      <table className="table table-striped">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <td>{index + 1}</td>
              <td>{task.user?.username}</td>
              <td>{task.name}</td>
              <td>{task.description}</td>
              <td>{task.category}</td>
              <td>{task.dueDate}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;



import { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api, { fetchTasksByUsername, deleteTaskById, fetchTasksDueToday } from "../../api/taskApi";
// REMOVED: import { generateTaskDescription } from "../../api/openai";
import TaskCompletionChart from "./TaskCompletionChart";
import PopularCategoriesChart from "./PopularCategoriesChart";
import ExportButtons from "./ExportButtons";
import './TaskDashboard.css';
import UpcomingTasksChart from "./UpcomingTasksChart";
import { generateLocalDescription } from "../../api/openai";


type Task = {
  id: number;
  name: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
};

type TaskFormData = {
  name: string;
  description: string;
  category: string;
  dueDate: string;
  status: string;
};

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const [backgroundImage, setBackgroundImage] = useState("/gradient.svg");
  const [tasksDueToday, setTasksDueToday] = useState<Task[]>([]);
  const [generating, setGenerating] = useState(false);

  const username = localStorage.getItem("username") || "";
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    setTimeout(() => setBackgroundImage("/end.svg"), 500);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<TaskFormData>();

  const fetchTasks = async () => {
    const data = await fetchTasksByUsername(username);
    setTasks(data);
    const dueToday = await fetchTasksDueToday(username);
    setTasksDueToday(dueToday);
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, data);
        setAlertMessage("Task updated successfully");
        setAlertType("success");
        setEditingTaskId(null);
        reset({ name: "", description: "", category: "", dueDate: "", status: "" });
      } else {
        await api.post(`/tasks/${username}`, data);
        setAlertMessage("Task added successfully");
        setAlertType("success");
        reset();
      }
      fetchTasks();
    } catch {
      setAlertMessage("Failed to submit task.");
      setAlertType("danger");
    } finally {
      setTimeout(() => setAlertMessage(null), 1000);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTaskById(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setAlertMessage("Task deleted successfully");
      setAlertType("success");
    } catch {
      setAlertMessage("Failed to delete task.");
      setAlertType("danger");
    } finally {
      setTimeout(() => setAlertMessage(null), 1000);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    reset({
      name: task.name,
      description: task.description,
      category: task.category,
      dueDate: task.dueDate,
      status: task.status,
    });
    setFocus("name");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleStatusToggle = async (task: Task) => {
    const updatedTask = { ...task, status: task.status === "PENDING" ? "COMPLETED" : "PENDING" };
    try {
      await api.put(`/tasks/${task.id}`, updatedTask);
      fetchTasks();
      setAlertMessage("Task status updated");
      setAlertType("success");
    } catch {
      setAlertMessage("Failed to update task status");
      setAlertType("danger");
    } finally {
      setTimeout(() => setAlertMessage(null), 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };


  return (
    <div className="container-fluid min-vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", transition: "background-image 1.5s ease-in-out" }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-light">Task Dashboard</h2>
          <div className="d-flex align-items-center">
            <span className="text-light me-3 fw-semibold">
              {username && <div className="glow-badge me-3">👤 {username}</div>}
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {alertMessage && (
          <div className={`alert alert-${alertType} alert-dismissible fade show position-absolute top-0 start-50 translate-middle-x mt-2`} style={{ zIndex: 1000, width: "auto" }} role="alert">
            {alertMessage}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlertMessage(null)}></button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className="input-group mb-2">
            <input type="text" placeholder="Task Name" className="form-control" {...register("name", { required: "Task name is required" })} />
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={() => {
                const values = getValues();
                if (!values.name || values.name.trim().length < 3) {
                  setAlertMessage("Please enter a task name (at least 3 characters)");
                  setAlertType("danger");
                  setTimeout(() => setAlertMessage(null), 2000);
                  return;
                }
                
                setGenerating(true);
                
                // Simulate loading time
                setTimeout(() => {
                  const description = generateLocalDescription(values.name);
                  setValue("description", description);
                  setAlertMessage("Description generated successfully!");
                  setAlertType("success");
                  setGenerating(false);
                  setTimeout(() => setAlertMessage(null), 2000);
                }, 800);
              }} 
              disabled={generating}
            >
              {generating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                "✨ Generate"
              )}
            </button>
          </div>
          {errors.name && <small className="text-danger">{errors.name.message}</small>}

          <div className="mb-2">
            <textarea placeholder="Description" className="form-control" {...register("description", { required: "Description is required" })} />
            {errors.description && <small className="text-danger">{errors.description.message}</small>}
          </div>

          <div className="mb-2">
            <input type="text" placeholder="Category" className="form-control" {...register("category", { required: "Category is required" })} />
            {errors.category && <small className="text-danger">{errors.category.message}</small>}
          </div>

          <div className="mb-2">
            <input type="date" className="form-control" {...register("dueDate", { required: "Due date is required" })} />
            {errors.dueDate && <small className="text-danger">{errors.dueDate.message}</small>}
          </div>

          <div className="mb-2">
            <select className="form-control" {...register("status", { required: "Status is required" })}>
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
            {errors.status && <small className="text-danger">{errors.status.message}</small>}
          </div>

          <button type="submit" className={`btn ${editingTaskId ? "btn-success" : "btn-primary"}`}>
            {editingTaskId ? "Update" : "Add Task"}
          </button>
        </form>

        {tasksDueToday.length > 0 && (
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">🕒 Tasks Due Today</div>
            <ul className="list-group list-group-flush">
              {tasksDueToday.map(task => (
                <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{task.name}</strong> – <span>{task.description}</span>
                  </div>
                  <span className={`badge ${task.status === "COMPLETED" ? "bg-success" : "bg-warning"}`}>{task.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ExportButtons tasks={tasks} />

        <div className="table-blur-wrapper table-responsive">
          <table className="table table-striped" >
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th >Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr className="text-center align-middle" key={task.id}>
                  <td>{index + 1}</td>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.category}</td>
                  <td >{task.dueDate}</td>
                  <td>{task.status}</td>
                  <td>
  <div className="d-flex flex-column gap-2">
    <div className="d-flex gap-2 w-100">
      <button
        className="btn btn-danger btn-sm flex-fill"
        onClick={() => handleDelete(task.id)}
        disabled={editingTaskId === task.id}
        title={editingTaskId === task.id ? "Cannot delete while editing" : ""}
      >
        Delete
      </button>
      <button
        className="btn btn-warning btn-sm flex-fill"
        onClick={() => handleEdit(task)}
      >
        Edit
      </button>
    </div>
    <button
      className={`btn btn-sm ${task.status === "PENDING" ? "btn-outline-success" : "btn-outline-secondary"}`}
      onClick={() => handleStatusToggle(task)}
    >
      {task.status === "PENDING" ? "Mark as Completed" : "Mark as Pending"}
    </button>
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <TaskCompletionChart tasks={tasks} />
            </div>
            <div className="col-md-6 mb-4">
              <UpcomingTasksChart tasks={tasks} />
            </div>
            <div>
              <PopularCategoriesChart tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
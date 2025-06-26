import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api, { fetchTasksByUsername, deleteTaskById } from "../../api/taskApi";
import './TaskDashboard.css';


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

  const username = "srinivasu";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>();

  const fetchTasks = async () => {
    const data = await fetchTasksByUsername(username);
    setTasks(data);
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, data);
        setAlertMessage("Task updated successfully");
      } else {
        await api.post(`/tasks/${username}`, data);
        setAlertMessage("Task added successfully");
      }
      setAlertType("success");
      fetchTasks();
      reset();
      setEditingTaskId(null);
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

  useEffect(() => {
    fetchTasks();
    setTimeout(() => setBackgroundImage("/end.svg"), 500);
  }, []);

  return (
    <div
      className="container-fluid min-vh-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1.5s ease-in-out",
      }}
    >
      <div className="container py-4">
        <h2 className="mb-4 text-light">Task Dashboard</h2>

        {alertMessage && (
          <div
            className={`alert alert-${alertType} alert-dismissible fade show position-absolute top-0 start-50 translate-middle-x mt-2`}
            style={{ zIndex: 1000, width: "auto" }}
            role="alert"
          >
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setAlertMessage(null)}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Task Name"
              className="form-control"
              {...register("name", { required: "Task name is required" })}
            />
            {errors.name && <small className="text-danger">{errors.name.message}</small>}
          </div>

          <div className="mb-2">
            <textarea
              placeholder="Description"
              className="form-control"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <small className="text-danger">{errors.description.message}</small>}
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Category"
              className="form-control"
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && <small className="text-danger">{errors.category.message}</small>}
          </div>

          <div className="mb-2">
            <input
              type="date"
              className="form-control"
              {...register("dueDate", { required: "Due date is required" })}
            />
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

          <button
            type="submit"
            className={`btn ${editingTaskId ? "btn-success" : "btn-primary"}`}
          >
            {editingTaskId ? "Update" : "Add Task"}
          </button>
        </form>

       <div className="table-blur-wrapper">
        <table className="table table-striped">
          <thead className="table-dark ">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{task.category}</td>
                <td>{task.dueDate}</td>
                <td>{task.status}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-3 ms-3"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className={`btn btn-sm ${
                      task.status === "PENDING"
                        ? "btn-outline-success"
                        : "btn-outline-secondary"
                    } ms-2`}
                    style={{ width: "140px" }}
                    onClick={() => handleStatusToggle(task)}
                  >
                    {task.status === "PENDING" ? "Mark as Completed" : "Mark as Pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

       </div>


      </div>
    </div>
  );
};

export default TaskDashboard;

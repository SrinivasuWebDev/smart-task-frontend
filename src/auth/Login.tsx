import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/taskApi";
// import './../components/TaskDashboard/TaskDashboard.css'

type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [alert, setAlert] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const [backgroundImage, setBackgroundImage] = useState("/loginstart.svg");
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post("/login", data);
      if (response.data.message === "Login successful") {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        setAlertType("success");
        setAlert("Login successful");
  
        setTimeout(() => {
          setAlert(null);
          if (response.data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setAlertType("danger");
        setAlert("Account is deactivated. Contact admin.");
      } else {
        setAlertType("danger");
        setAlert("Invalid credentials");
      }
    }
  };

   useEffect(() => {
      setTimeout(() => setBackgroundImage("/loginback.svg"), 500);
    }, []);

  return (


    <div
    className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
    style={{
      backgroundImage: "url('/ade.svg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
    }}
  >
    <div className="container mt-2 login-back py-2" style={{ maxWidth: "400px", backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1.5s ease-in-out",}}>
      <h3 className="mb-4 text-center text-light">Login</h3>

      {alert && (
        <div className={`alert alert-${alertType} text-center`} role="alert">
          {alert}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            autoComplete="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <small className="text-danger">{errors.username.message}</small>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <small className="text-danger">{errors.password.message}</small>}
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      <p className="mt-3 text-center">
        Don't have an account? <Link to="#">Register here</Link>
        {/* disabled register link but component is ready*/}
      </p>
    </div>

    </div>
  );
};

export default Login;

// src/auth/Register.tsx
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/taskApi";
import { useEffect, useState } from "react";
import "./Register.css";  // we'll add a bit of CSS here

type RegisterForm = {
  username: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterForm>();

  const [backgroundImage, setBackgroundImage] = useState("/loginstart.svg");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setBackgroundImage("/registerlogin3.svg"), 500);
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/register", { ...data, role: "USER" });
      setAlertType("success");
      setAlertMessage("Registered successfully — redirecting to login…");
      reset();
      setTimeout(() => {
        setAlertMessage(null);
        navigate("/login");
      }, 1500);
    } catch {
      setAlertType("danger");
      setAlertMessage("Registration failed. Please try again.");
      setTimeout(() => setAlertMessage(null), 2000);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('/registerback.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* Fixed top alert */}
      {alertMessage && (
        <div
          className={`alert alert-${alertType} position-fixed slide-down`}
          role="alert"
        >
          {alertMessage}
        </div>
      )}

      <div
        className="container mt-5 login-back pt-1"
        style={{
          maxWidth: "400px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1.5s ease-in-out",
        }}
      >
        <h3 className="mb-4 text-center text-light">Register</h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              className="form-control"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <small className="text-danger">{errors.username.message}</small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "At least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                  message:
                    "Must include uppercase, number & special character",
                },
              })}
            />
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Go to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminPrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/auth/check-auth", { withCredentials: true })
      .then(res => {
        if (res.data.role === "admin") setAuth(true);
        else setAuth(false);
      })
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" state={{ error: "You are not logged in as admin" }} />;

  return children;
};

export default AdminPrivateRoute;

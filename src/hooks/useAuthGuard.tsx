import { useEffect } from "react";
import { useNavigate } from "./useNavigate";

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("login");
    }
  }, [navigate]);
}

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { generateApiOrigin } from "../utils/apiOrigin";
import { getAuthHeader, removeToken } from "../utils/token";
import io from "socket.io-client";
import socket from "../utils/socket";

const AuthContext = createContext();

const urlFetch = generateApiOrigin("/api/auth/me");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get(urlFetch, {
        headers: getAuthHeader(),
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch user");
      }
      const data = response.data.user;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    socket.emit("join", user.userId);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

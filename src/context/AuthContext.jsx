import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const USER_KEY = "auth_user";
const TOKEN_KEY = "auth_token";
const LOCAL_USERS_KEY = "local_users";

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Restore session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // ✅ Save session whenever user/token changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user, token]);

  // ✅ Signup (LocalStorage-based)
  const signupLocal = async ({ username, email, password }) => {
    const users = getLocalUsers();

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (usernameExists) {
      throw new Error("Username already exists.");
    }
    if (emailExists) {
      throw new Error("Email already exists.");
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password, // stored locally (demo project)
      source: "local",
    };

    users.push(newUser);
    saveLocalUsers(users);

    // Auto-login after signup
    setUser({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      source: "local",
    });
    setToken("local-demo-token-" + newUser.id);
  };

  // ✅ Login supports:
  // 1) Local users (signup)
  // 2) DummyJSON users (JWT)
  const login = async (username, password) => {
    // 1️⃣ Check local users first
    const localUsers = getLocalUsers();
    const foundLocal = localUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (foundLocal) {
      setUser({
        id: foundLocal.id,
        username: foundLocal.username,
        email: foundLocal.email,
        source: "local",
      });
      setToken("local-demo-token-" + foundLocal.id);
      return;
    }

    // 2️⃣ Otherwise use DummyJSON API
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) throw new Error("DummyJSON login failed");

    const data = await res.json();

    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      source: "dummyjson",
    });

    // DummyJSON returns token
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        signupLocal, // ✅ added
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

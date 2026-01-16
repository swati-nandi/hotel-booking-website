import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://dummyjson.com/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // save token + user info
      login({
        username: res.data.username,
        token: res.data.token,
        email: res.data.email,
        image: res.data.image,
      });

      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <label className="text-sm font-medium text-gray-700">Username</label>
        <input
          className="w-full mt-1 mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="w-full mt-1 mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-xs text-gray-500 text-center mt-5">
          <p className="font-semibold">Test Credentials</p>
          <p>
            Username: <b>emilys</b>
          </p>
          <p>
            Password: <b>emilyspass</b>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;

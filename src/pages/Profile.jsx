import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold">You are not logged in</h1>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Manage your account and view your information.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border dark:border-gray-800 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Account Details</h2>

          <div className="space-y-3 text-gray-700 dark:text-gray-200">
            <p>
              <span className="text-gray-500 dark:text-gray-400">
                Username/Email:
              </span>{" "}
              <b>{user.username || user.email}</b>
            </p>

            {user.email && (
              <p>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>{" "}
                <b>{user.email}</b>
              </p>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              (Session is stored in localStorage)
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4">Session</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Token Preview:
          </p>

          <div className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg break-words">
            {user.token}
          </div>
        </div>
      </div>

      <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">
          Coming Soon ✨
        </h3>
        <p className="text-blue-700 dark:text-blue-200 mt-2 text-sm">
          Download booking PDFs, custom themes and more features.
        </p>
      </div>
    </div>
  );
}

export default Profile;

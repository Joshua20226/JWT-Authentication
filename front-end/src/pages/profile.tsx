import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600">Username:</label>
            <p className="font-medium">{user?.username}</p>
          </div>
          
          <div>
            <label className="block text-gray-600">Email:</label>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

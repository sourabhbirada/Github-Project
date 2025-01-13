import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [stars, setStars] = useState(0); // Placeholder for counting stars
  const [followers, setFollowers] = useState([]); // Store followers
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [username, setUsername] = useState(""); // State for username input
  const [email, setEmail] = useState(""); // State for email input
  const navigate = useNavigate();

  // Fetch user data, repositories, and followers
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = "675007e678449671265a204c";
        
        // Fetch user details (name, email, followers)
        const userResponse = await axios.get(`https://github-project-k4z5.onrender.com/user/${userId}`);
        setUser(userResponse.data);
        setUsername(userResponse.data.username || userResponse.data.name); // Set name from response
        setEmail(userResponse.data.email); // Set email from response

        // Fetch user's repositories
        const repoResponse = await axios.get(`https://github-project-k4z5.onrender.com/repo/user/${userId}`);
        setRepos(repoResponse.data.repos);
        
        // Count stars for the user's repositories (assuming each repo has a 'stars' field)
        const totalStars = repoResponse.data.repos.reduce((sum, repo) => sum + repo.stars, 0);
        setStars(totalStars);

        // Fetch followers
        const followersResponse = await axios.get(`https://github-project-k4z5.onrender.com/followers/${userId}`);
        setFollowers(followersResponse.data.followers);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle the update of name and email
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const updateResponse = await axios.put(`https://github-project-k4z5.onrender.com/user/${userId}`, {
        username,
        email
      });

      // Update the user state with the new values
      setUser((prevUser) => ({
        ...prevUser,
        username: updateResponse.data.username,
        email: updateResponse.data.email
      }));

      // Turn off edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`https://github-project-k4z5.onrender.com/user/${userId}`);
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      navigate('/signup');
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  };

  const handleRepoClick = (repoId) => {
    navigate(`/repo-deaits/${repoId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column - Profile Info */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-[#21262d] rounded-lg p-6 transform transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar_url || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EHDpqYq4MkBLDe35tokQz8UoBfZCxm.png"}
              alt="Profile"
              className="w-64 h-64 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
            <p className="text-gray-400 mb-4">{user.bio || "Backend Developer | Web Apps | DSA Enthusiast"}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
              <span>{followers.length} followers</span>
              <span>•</span>
              <span>{user.following || 2} following</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 bg-[#2d333b] border border-gray-700 rounded-md hover:bg-[#3a434b] transition-colors duration-300"
            >
              Edit profile
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="bg-[#161b22] rounded-lg p-6 animate-[fadeIn_0.3s_ease-out]">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-[#2d333b] border border-gray-700 rounded-md hover:bg-[#3a434b] transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right Column - Repos & Stats */}
      <div className="md:col-span-2 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#21262d] rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-400">Repositories</h3>
            <p className="text-2xl font-bold mt-2">{repos.length}</p>
          </div>
          <div className="bg-[#21262d] rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-400">Stars</h3>
            <p className="text-2xl font-bold mt-2">{stars}</p>
          </div>
          <div className="bg-[#21262d] rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-gray-400">Followers</h3>
            <p className="text-2xl font-bold mt-2">{followers.length}</p>
          </div>
        </div>

        {/* Repositories */}
        <div className="bg-[#161b22] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Repositories</h2>
          <div className="space-y-4">
            {repos.map((repo) => (
              <div
                key={repo._id}
                onClick={() => window.location.href = `/repo-details/${repo._id}`}
                className="bg-[#21262d] p-4 rounded-lg cursor-pointer hover:bg-[#2d333b] transition-colors duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-blue-400 font-medium hover:underline">
                      {repo.reponame}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{repo.desc}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{repo.stars || 0} stars</span>
                    <span>{repo.forks || 0} forks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#161b22] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h2>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Profile;

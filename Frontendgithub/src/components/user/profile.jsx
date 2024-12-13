import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../../style/profile.css"; 

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
        const userId = localStorage.getItem('userId');
        
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
    <div className="profile-container">
      <div className="profile-grid">
        {/* First Column: User Details */}
        <div className="profile-details">
          <img
            src={user.avatar_url}
            alt="Avatar"
            className="profile-avatar"
          />
          <h2 className="profile-name">{user.username}</h2>
          <p className="profile-bio">{user.bio}</p>
          <div className="profile-stats">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Followers:</strong> {followers.length}</p>
          </div>

          <button className="update-button" onClick={() => setIsEditing(true)}>
            Update
          </button>

          <button className="delete-button" onClick={handleDelete}>Delete Account</button>

          {/* Conditional Rendering of Edit Form */}
          {isEditing && (
            <form onSubmit={handleUpdate} className="update-form">
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Save</button>
            </form>
          )}
        </div>

        {/* Second Column: Repositories */}
        <div className="repo-details">
          <h3>Your Repositories</h3>
          <p>Total Repos: {repos.length}</p>
          <p>Total Stars: {stars}</p>
          <ul>
            {repos.map((repo) => (
              <li key={repo._id} className="repo-item">
                <strong>{repo.reponame}</strong>
                <p>{repo.desc}</p>
                <p>Visibility: {repo.visibility}</p>
                <button onClick={() => handleRepoClick(repo._id)}>View Details</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Third Column: Followers */}
        <div className="followers-details">
          <h3>Followers</h3>
          <ul>
            {followers.map((follower) => (
              <li key={follower.id}>{follower.username}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

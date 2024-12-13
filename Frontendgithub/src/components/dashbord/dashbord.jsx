import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../style/dashbord.css';

const Dashboard = () => {
  const [repo, setRepo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepo, setSuggestedRepo] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log(userId);
    
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`https://github-project-k4z5.onrender.com/repo/user/${userId}`);
        setRepo(res.data.repos);
      } catch (error) {
        console.error("Error fetching user repositories:", error);
      }
    };

    const fetchAllRepo = async () => {
      try {
        const res = await axios.get(`https://github-project-k4z5.onrender.com/repo/all`);
        setSuggestedRepo(res.data.repos);
      } catch (error) {
        console.error("Error fetching all repositories:", error);
      }
    };

    fetchRepo();
    fetchAllRepo();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResult(repo);
    } else {
      const usersearch = repo.filter((repository) =>
        repository.reponame.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResult(usersearch);
    }
  }, [searchQuery, repo]);

  const handleRepoClick = (repoId) => {
    
    navigate(`/repo-deaits/${repoId}`);
  };

  return (
    <div className="dashboard">
      <div className="user-repositories">
        <h3>User Repositories</h3>

        <div id="search">
          <input
            type="text"
            placeholder="Search User Repositories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ul>
          {searchResult.length > 0 ? (
            searchResult.map((repository) => (
              <li key={repository._id} onClick={() => handleRepoClick(repository._id)}>
                <strong>{repository.reponame}</strong>
                <p>{repository.desc}</p>
              </li>
            ))
          ) : (
            <li>No repositories found.</li>
          )}
        </ul>
      </div>

      <div className="main-content">
        <div className="suggested-repositories">
          <h3>Suggested Repositories</h3>
          <ul>
            {suggestedRepo.length > 0 ? (
              suggestedRepo.map((repository) => (
                <li key={repository._id} onClick={() => handleRepoClick(repository._id)}>
                  <strong>{repository.reponame}</strong>
                  <p>{repository.desc}</p>
                </li>
              ))
            ) : (
              <li>No repositories found.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="user-changes">
        <h4>User Profile</h4>
        <ul>
          <li>
            <button
              onClick={() => navigate('/user-profile')}
              className="btn btn-profile"
            >
              Show User Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/create-repo')}  
              className="btn btn-create-repo"
            >
              Create New Repo
            </button>
          </li>
          <li>
            <button
              onClick={() => alert('More Options Coming Soon')}
              className="btn btn-more-options"
            >
              More
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

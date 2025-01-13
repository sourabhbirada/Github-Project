'use client'

import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [repo, setRepo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepo, setSuggestedRepo] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [latestChanges, setLatestChanges] = useState([
    { id: 1, date: '2 days ago', title: 'Updated repository structure' },
    { id: 2, date: '3 days ago', title: 'Added new feature implementation' },
    { id: 3, date: '3 days ago', title: 'Fixed critical bug in auth flow' },
    { id: 4, date: 'Last week', title: 'Initial commit' }
  ]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    const fetchRepo = async () => {
      try {
        const res = await fetch(`https://github-project-k4z5.onrender.com/repo/user/${userId}`);
        const data = await res.json();
        
        
        setRepo(data.repos);
      } catch (error) {
        console.error("Error fetching user repositories:", error);
      }
    };

    const fetchAllRepo = async () => {
      try {
        const res = await fetch(`https://github-project-k4z5.onrender.com/repo/all`);
        const data = await res.json();
        setSuggestedRepo(data.repos);
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex">
      
        <div className="w-80 h-screen bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top repositories</h2>
            <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
              New
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
          <ul className="space-y-2">
            {searchResult.map((repository) => (
              <li 
                key={repository._id}
                className="p-2 hover:bg-gray-800 rounded-md cursor-pointer transition-colors"
              >
                <h3 className="text-sm font-medium">{repository.reponame}</h3>
                <p className="text-xs text-gray-400 truncate">{repository.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Ask Copilot..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="grid gap-4">
              {suggestedRepo.map((repository) => (
                <div 
                  key={repository._id}
                  className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-blue-400">{repository.reponame}</h3>
                      <p className="text-sm text-gray-400 mt-1">{repository.desc}</p>
                    </div>
                    <button className="px-3 py-1 bg-[#21262d] border border-gray-700 rounded-md hover:bg-gray-700 transition-colors text-sm">
                      Star
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="w-80 h-screen bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
          <div className="mb-6">
            <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg border border-gray-800 mb-4">
              <img
                src="https://via.placeholder.com/80"
                alt="Profile"
                className="w-20 h-20 rounded-full mb-3"
              />
              <h3 className="text-lg font-semibold mb-1">John Doe</h3>
              <p className="text-sm text-gray-400 mb-3">@johndoe</p>
              <button 
                onClick={() => window.location.href = '/user-profile'}
                className="w-full px-3 py-1.5 bg-[#21262d] border border-gray-700 rounded-md hover:bg-gray-700 transition-colors text-sm mb-2"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => window.location.href = '/create-repo'}
                className="w-full px-3 py-1.5 bg-[#21262d] border border-gray-700 rounded-md hover:bg-gray-700 transition-colors text-sm"
              >
                Create Repository
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <h3 className="text-sm font-semibold mb-3">Latest changes</h3>
              <ul className="space-y-3">
                {latestChanges.map((change) => (
                  <li key={change.id} className="text-sm">
                    <span className="text-gray-400 text-xs">{change.date}</span>
                    <p className="text-gray-300">{change.title}</p>
                  </li>
                ))}
              </ul>
              <button className="text-sm text-blue-400 hover:text-blue-300 mt-3">
                View changelog →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


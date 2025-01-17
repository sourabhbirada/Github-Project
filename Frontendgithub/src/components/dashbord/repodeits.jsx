import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Mock commit data remains the same
const mockCommits = [
  {
    id: '1',
    hash: 'a1b2c3d',
    message: 'Update authentication flow',
    author: 'Sourabh Birada',
    date: '2024-03-20T10:30:00',
    changes: { additions: 120, deletions: 84 }
  },
  {
    id: '2',
    hash: 'e4f5g6h',
    message: 'Implement real-time updates',
    author: 'Sourabh Birada',
    date: '2024-03-19T15:45:00',
    changes: { additions: 256, deletions: 128 }
  },
  {
    id: '3',
    hash: 'i7j8k9l',
    message: 'Fix performance issues in dashboard',
    author: 'Sourabh Birada',
    date: '2024-03-18T09:15:00',
    changes: { additions: 45, deletions: 23 }
  }
];

const RepoDetail = () => {
  // State declarations remain the same
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [reponame, setReponame] = useState('');
  const [desc, setDesc] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [activeTab, setActiveTab] = useState('files');

  // useEffect and handlers remain the same
  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const res = await axios.get(`https://github-project-k4z5.onrender.com/repo/id/${id}`);
        if (res.data && res.data.data) {
          setRepo(res.data.data);
          setReponame(res.data.data.reponame);
          setDesc(res.data.data.desc);
          setVisibility(res.data.data.visibility);
        }
      } catch (error) {
        console.error("Error fetching repository details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateRepo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reponame', reponame);
    formData.append('desc', desc);
    formData.append('visibility', visibility);
    if (file) formData.append('files', file);

    try {
      const res = await axios.put(`https://github-project-k4z5.onrender.com/repo/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRepo(res.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating repository:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117]">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-[#1f6feb] border-solid rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-t-4 border-[#1f6feb]/30 border-solid rounded-full animate-spin absolute top-0 left-0" style={{ animationDelay: '-0.3s' }}></div>
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Repository Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#1f6feb] rounded-lg hover:bg-[#388bfd] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 ">
      {/* Repository Header */}
      <div className="border-b border-[#30363d] bg-[#161b22] py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-3 group">
              <span className="w-10 h-10 bg-[#1f6feb] rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                {reponame.charAt(0).toUpperCase()}
              </span>
              <span className="group-hover:text-[#388bfd] transition-colors duration-300">{repo.reponame}</span>
            </h2>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                repo.visibility ? 'bg-[#238636] text-[#7ee787]' : 'bg-[#da3633] text-[#ffa198]'
              } animate-pulse`}>
                {repo.visibility ? 'Public' : 'Private'}
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-[#1f6feb] rounded-lg hover:bg-[#388bfd] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Repository'}
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-lg">{repo.desc}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Repository Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('files')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'files' 
                    ? 'bg-[#1f6feb] text-white transform scale-105' 
                    : 'bg-[#21262d] text-gray-400 hover:bg-[#30363d]'
                }`}
              >
                Files
              </button>
              <button
                onClick={() => setActiveTab('branches')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'branches' 
                    ? 'bg-[#1f6feb] text-white transform scale-105' 
                    : 'bg-[#21262d] text-gray-400 hover:bg-[#30363d]'
                }`}
              >
                Branches
              </button>
            </div>

            {/* Files Section */}
            {activeTab === 'files' && (
              <div className="bg-[#161b22] rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Repository Files</h3>
                <div className="space-y-2">
                  {repo.files && repo.files.length > 0 ? (
                    repo.files.map((file, index) => (
                      <div 
                        key={index}
                        className="group flex items-center justify-between p-3 bg-[#21262d] rounded-lg hover:bg-[#30363d] transition-all duration-300 transform hover:-translate-x-2"
                      >
                        <a 
                          href={`https://github-project-k4z5.onrender.com/uploads/${file.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#388bfd] hover:text-[#58a6ff] transition-colors duration-300"
                        >
                          {file.filename}
                        </a>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No files uploaded yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Branches Section */}
            {activeTab === 'branches' && (
              <div className="bg-[#161b22] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Branches</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#21262d] rounded-lg">
                    <span className="text-[#7ee787]">main</span>
                    <span className="text-sm text-gray-400">Default</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#21262d] rounded-lg">
                    <span className="text-[#388bfd]">develop</span>
                    <span className="text-sm text-gray-400">Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Commit History */}
          <div className="lg:w-1/3">
            <div className="bg-[#161b22] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Commit History</h3>
              <div className="space-y-4">
                {mockCommits.map((commit) => (
                  <div
                    key={commit.id}
                    className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedCommit === commit.id
                        ? 'bg-[#1f6feb]'
                        : 'bg-[#21262d] hover:bg-[#30363d] transform hover:-translate-x-2'
                    }`}
                    onClick={() => setSelectedCommit(commit.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-gray-400">
                        {commit.hash}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(commit.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium mb-2">{commit.message}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{commit.author}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#7ee787]">+{commit.changes.additions}</span>
                        <span className="text-[#ffa198]">-{commit.changes.deletions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-[#161b22] rounded-lg p-6 max-w-2xl w-full animate-slideIn">
              <form onSubmit={handleUpdateRepo} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={reponame}
                    onChange={(e) => setReponame(e.target.value)}
                    className="w-full bg-[#21262d] border border-[#30363d] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-[#21262d] border border-[#30363d] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value === 'true')}
                    className="w-full bg-[#21262d] border border-[#30363d] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent"
                  >
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-[#21262d] text-gray-300 rounded-lg tracking-wide border border-[#30363d] cursor-pointer hover:bg-[#30363d] transition-all duration-300">
                      <span className="mt-2 text-base">
                        {file ? file.name : 'Select a file'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1f6feb] text-white px-4 py-2 rounded-lg hover:bg-[#388bfd] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-[#21262d] text-white px-4 py-2 rounded-lg hover:bg-[#30363d] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoDetail;
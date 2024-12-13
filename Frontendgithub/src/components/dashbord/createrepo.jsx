import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRepo = () => {
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleCreateRepo = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem("userId");
    console.log("Retrieved userId from localStorage:", userId);
  
    const formData = new FormData();
    formData.append('reponame', repoName);
    formData.append('desc', repoDesc);
    formData.append('visibility', visibility);
    formData.append('owner', userId);
  
    for (const file of files) {
      formData.append('files', file);
    }
  
    
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const res = await axios.post('https://github-project-k4z5.onrender.com/repo/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Repository created:', res.data);
      navigate('/');
    } catch (error) {
      console.error('Error creating repository:', error);
    }
  };
  

  return (
    <div className="create-repo">
      <h3>Create New Repository</h3>
      <form onSubmit={handleCreateRepo}>
        <div className="form-group">
          <label>Repository Name:</label>
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Repository Description:</label>
          <textarea
            value={repoDesc}
            onChange={(e) => setRepoDesc(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Visibility:</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value === 'true')} 
          >
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>
        <div className="form-group">
          <label>Upload Files:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <button type="submit">Create Repository</button>
      </form>
    </div>
  );
};

export default CreateRepo;

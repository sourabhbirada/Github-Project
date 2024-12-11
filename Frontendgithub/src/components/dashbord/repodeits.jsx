import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/repodeits.css';

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [reponame, setReponame] = useState('');
  const [desc, setDesc] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/repo/id/${id}`);
        if (res.data && res.data.data) {
          setRepo(res.data.data);
          setReponame(res.data.data.reponame);
          setDesc(res.data.data.desc);
          setVisibility(res.data.data.visibility);
        } else {
          console.error("No repository data found");
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
    if (file) formData.append('files', file); // Attach the file if selected

    try {
      const res = await axios.put(`http://localhost:3000/repo/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Repo updated:', res.data);
      setRepo(res.data.data); // Update repo state with the response data
      setIsEditing(false); // Switch off editing mode
    } catch (error) {
      console.error("Error updating repository:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!repo) {
    return <div>No repository found.</div>;
  }

  return (
    <div className="repo-detail">
      <h2>{repo.reponame}</h2>
      <p>{repo.desc}</p>
      <p><strong>Visibility:</strong> {repo.visibility ? 'Public' : 'Private'}</p>
      <h3>Files:</h3>
      <ul>
        {repo.files && repo.files.length > 0 ? (
          repo.files.map((file, index) => (
            <li key={index}>
              <a href={`http://localhost:3000/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>
            </li>
          ))
        ) : (
          <li>No files uploaded.</li>
        )}
      </ul>

      {/* Update Form */}
      {isEditing && (
        <>
          <form onSubmit={handleUpdateRepo} className="update-form">
            <div>
              <label htmlFor="reponame">Repository Name:</label>
              <input
                type="text"
                id="reponame"
                value={reponame}
                onChange={(e) => setReponame(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="desc">Description:</label>
              <textarea
                id="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="visibility">Visibility:</label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value === 'true')}
              >
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
            </div>
            <div>
              <label htmlFor="file">Upload File:</label>
              <input type="file" id="file" onChange={handleFileChange} />
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </>
      )}

      {!isEditing && (
        <button onClick={() => setIsEditing(true)}>Edit Repository</button>
      )}
    </div>
  );
};

export default RepoDetail;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRepo = () => {
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [files, setFiles] = useState([]);
  const [includeReadme, setIncludeReadme] = useState(false)
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
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Create a new repository</h1>
        <p className="text-gray-400 mb-8">
          A repository contains all project files, including the revision history.{" "}
          <span className="text-gray-400">Already have a project repository elsewhere? </span>
          <a href="#" className="text-blue-400 hover:underline">
            Import a repository.
          </a>
        </p>

        <p className="text-sm text-gray-400 mb-4 italic">
          Required fields are marked with an asterisk (*).
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="relative">
              <select className="appearance-none bg-[#21262d] border border-[#30363d] rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:border-blue-500">
                <option>sourabh</option>
              </select>
              <span className="absolute right-2 top-2.5 text-gray-400">/</span>
            </div>
            <input
              type="text"
              placeholder="Repository name"
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="space-y-4 border border-[#30363d] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="public"
                name="visibility"
                checked={visibility === "public"}
                onChange={() => setVisibility("public")}
                className="mt-1"
              />
              <div>
                <label htmlFor="public" className="flex items-center gap-2 font-medium">
                  <svg viewBox="0 0 16 16" width="16" height="16" className="fill-current">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                  Public
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  Anyone on the internet can see this repository. You choose who can commit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="private"
                name="visibility"
                checked={visibility === "private"}
                onChange={() => setVisibility("private")}
                className="mt-1"
              />
              <div>
                <label htmlFor="private" className="flex items-center gap-2 font-medium">
                  <svg viewBox="0 0 16 16" width="16" height="16" className="fill-current">
                    <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25zM10 4a2 2 0 1 0-4 0v2h4z"></path>
                  </svg>
                  Private
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  You choose who can see and commit to this repository.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#30363d] pt-4">
            <h3 className="font-medium mb-4">Initialize this repository with:</h3>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="readme"
                checked={includeReadme}
                onChange={(e) => setIncludeReadme(e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="readme" className="font-medium">Add a README file</label>
                <p className="text-sm text-gray-400 mt-1">
                  This is where you can write a long description for your project.{" "}
                  <a href="#" className="text-blue-400 hover:underline">
                    Learn more about READMEs.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRepo;

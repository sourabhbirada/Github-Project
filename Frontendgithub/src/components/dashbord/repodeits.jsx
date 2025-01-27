import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { URL_MAIN } from "../../utiltis/content"
import Editor from "@monaco-editor/react"

const RepoDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [repo, setRepo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [reponame, setReponame] = useState("")
  const [desc, setDesc] = useState("")
  const [visibility, setVisibility] = useState(false)
  const [file, setFile] = useState(null)
  const [activeTab, setActiveTab] = useState("files")
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState("")

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const res = await axios.get(`${URL_MAIN}/repo/id/${id}`)
        if (res.data && res.data.data) {
          setRepo(res.data.data)
          setReponame(res.data.data.reponame)
          setDesc(res.data.data.desc)
          setVisibility(res.data.data.visibility)
        }
      } catch (error) {
        console.error("Error fetching repository details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepoDetails()
  }, [id])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileData = async (filename) => {
    try {
      const res = await axios.get(`${URL_MAIN}/uploads/1737858485820-recursion.cpp`)
      setSelectedFile(filename)
      setFileContent(res.data)
    } catch (error) {
      console.error("Error fetching file content:", error)
    }
  }

  const handleUpdateRepo = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("reponame", reponame)
    formData.append("desc", desc)
    formData.append("visibility", visibility)
    if (file) formData.append("files", file)

    try {
      const res = await axios.put(`${URL_MAIN}/repo/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setRepo(res.data.data)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating repository:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <div
            className="w-16 h-16 border-t-4 border-blue-500/30 border-solid rounded-full animate-spin absolute top-0 left-0"
            style={{ animationDelay: "-0.3s" }}
          ></div>
        </div>
      </div>
    )
  }

  if (!repo) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Repository Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="border-b border-gray-700 bg-gray-800 py-6 px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-3 group">
            <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              {reponame.charAt(0).toUpperCase()}
            </span>
            <span className="group-hover:text-blue-400 transition-colors duration-300">{repo.reponame}</span>
          </h2>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${repo.visibility ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"} animate-pulse`}
            >
              {repo.visibility ? "Public" : "Private"}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              {isEditing ? "Cancel Edit" : "Edit Repository"}
            </button>
          </div>
        </div>
        <p className="text-gray-400 text-lg">{repo.desc}</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="w-1/3">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("files")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === "files"
                    ? "bg-blue-600 text-white transform scale-105"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                Files
              </button>
              <button
                onClick={() => setActiveTab("branches")}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === "branches"
                    ? "bg-blue-600 text-white transform scale-105"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                Branches
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              {activeTab === "files" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Repository Files</h3>
                  <div className="space-y-2">
                    {repo.files && repo.files.length > 0 ? (
                      repo.files.map((file, index) => (
                        <div
                          key={index}
                          className="group flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:-translate-x-2"
                        >
                          <button
                            onClick={() => handleFileData(file.filename)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                          >
                            {file.filename}
                          </button>
                          <span className="text-sm text-gray-400 group-hover:text-gray-300">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">No files uploaded yet</div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "branches" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Branches</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-green-400">main</span>
                      <span className="text-sm text-gray-400">Default</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-blue-400">develop</span>
                      <span className="text-sm text-gray-400">Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-2/3">
            {selectedFile && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Editing: {selectedFile}</h3>
                <Editor
                  height="70vh"
                  defaultLanguage="javascript"
                  value={fileContent}
                  onChange={(value) => setFileContent(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full animate-slideIn">
              <form onSubmit={handleUpdateRepo} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Repository Name</label>
                  <input
                    type="text"
                    value={reponame}
                    onChange={(e) => setReponame(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Visibility</label>
                  <select
                    value={visibility.toString()}
                    onChange={(e) => setVisibility(e.target.value === "true")}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload File</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700 text-gray-300 rounded-lg tracking-wide border border-gray-600 cursor-pointer hover:bg-gray-600 transition-all duration-300">
                      <span className="mt-2 text-base">{file ? file.name : "Select a file"}</span>
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1"
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
  )
}

export default RepoDetail


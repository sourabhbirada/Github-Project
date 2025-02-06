import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { URL_MAIN } from "../../utiltis/content"
import Editor from "@monaco-editor/react"
import ReactMarkdown from 'react-markdown';
import useUserprofile from "../../utiltis/useUserprofile"



const RepoDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [repo, setRepo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [activeTab, setActiveTab] = useState("files")
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState("")
  const [readmecontent, setreadmecontent] = useState("")

  console.log("File content type:", typeof fileContent);


  const userid = localStorage.getItem("userId")


  const user = useUserprofile(userid)

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {



        const res = await axios.get(`${URL_MAIN}/repo/id/${id}`)
        console.log(res.data);

        if (res.data && res.data.data) {
          setRepo(res.data.data)
          const readme = res.data.data.files?.find((file) => file.filename === "README.md");
          if (readme) {
            const readmeRes = await axios.get(`${URL_MAIN}/uploads/${readme.filename}`);
            setreadmecontent(readmeRes.data);
          }
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
      const res = await axios.get(`${URL_MAIN}/uploads/${filename}`)
      setSelectedFile(filename)
      setFileContent(res.data)
    } catch (error) {
      console.error("Error fetching file content:", error)
    }
  }

  if (loading) {
    return (
      <div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
        <span className='sr-only'>Loading...</span>
        <div className='h-8 w-8 bg-gray-900 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-8 w-8 bg-gray-900 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-8 w-8 bg-gray-900 rounded-full animate-bounce'></div>
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
      <div>
        <div className="flex justify-between items-center mx-32 gap-4 pt-9">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{repo.reponame}</h1>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {repo.visibility ? "Public" : "Private"}
            </span>
          </div>
          <div className="flex  gap-9">
            <p>Unwatch</p>
            <p>Pin</p>
          </div>
        </div>
        {repo.desc && (
          <div className="mt-4 ml-40">
            <p className="text-muted-foreground">{repo.desc}</p>
          </div>
        )}
      </div>
      {/* repo body*/}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* File Browser */}
        <div className="h-[calc(100vh-8rem)] w-full max-w-sm ">
          <div className="flex items-center border-b px-4 py-3">
            <div className="size-5 rounded-full bg-muted" />
            <p className="ml-2 text-sm font-medium">{user.user.username}</p>
          </div>

          {/* File List */}
          {repo.files && repo.files.length > 0 ? (
            <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 40px)" }}>
              {repo.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-4 border-b border-gray-200 hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 3.5A2.5 2.5 0 014.5 1h7.707a2.5 2.5 0 011.768.732l3.293 3.293A2.5 2.5 0 0118 6.793V16.5A2.5 2.5 0 0115.5 19h-11A2.5 2.5 0 012 16.5v-13z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <button
                      className="font-medium text-sm text-left"
                      onClick={() => handleFileData(file.filename)}
                    >
                      {file.filename}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{file.size} KB</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 p-4 text-center">No files available</p>
          )}
        </div>

        <div className="h-[calc(100vh-8rem)]">
          {selectedFile ? (
            <Editor
              height="100%"
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
          ) : (
            readmecontent && (
              <div className="h-full overflow-auto rounded-lg bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">README.md</h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown>{readmecontent}</ReactMarkdown>
                </div>
              </div>
            )
          )}
        </div>
      </div>




    </div>
  )
}

export default RepoDetail


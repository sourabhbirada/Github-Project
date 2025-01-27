import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { URL_MAIN } from "../../utiltis/content"
import useUserprofile from "../../utiltis/useUserprofile"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [stars, setStars] = useState(0)
  const [starsrepo , setstarrepo] = useState([])
  const [followers, setFollowers] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [showAllRepos, setShowAllRepos] = useState(true)
  const [showAllStars, setShowAllStars] = useState(false)
  const [showAllFollowers, setShowAllFollowers] = useState(false)
  const [updateusername , setupdateusername] = useState(username);
  const [updateemail , setupdateemail] = useState(email);

  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")

  const userdata = useUserprofile(userId)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userdata) {
          setUser(userdata)
          setUsername(userdata.user.username || "")
          setEmail(userdata.user.email || "")
          setStars(userdata.user.repositories.length)
          
          if (userdata.user.repositories.length > 0) {
            const repoDetails = await Promise.all(
              userdata.user.repositories.map((repoId) =>
                axios.get(`${URL_MAIN}/repo/id/${repoId}`).then((res) => res.data)
              )
            );
            console.log(repoDetails);
            
            setstarrepo(repoDetails); 
          }
          if(userdata.user.followers.length > 0){
            const followerDetails = await Promise.all(
              userdata.user.followers.map((useID) => {
                useUserprofile(useID);
              })
            )
            console.log(followerDetails);
            
            setFollowers(followerDetails || 0)
          }
        }
        const repoResponse = await axios.get(`${URL_MAIN}/repo/user/${userId}`)
        setRepos(repoResponse.data.repos)
        
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            setError(error.response.data.error || "Failed to fetch user data.")
          } else if (error.request) {
            setError("No response from the server. Please try again later.")
          } else {
            setError("An unexpected error occurred. Please try again.")
          }
        } else {
          setError("Something went wrong. Please try again.")
        }
      }
    }

    fetchUserData()
   
  }, [userdata, userId])

  const handleUpdate = async (e) => {
    e.preventDefault();
     const updatefield = {}
     if(updateusername !== username) updatefield.username = updateusername
     if(updateemail !== email ) updatefield.email = updateemail
    try {
      const res = await axios.put(`${URL_MAIN}/user/${userId}`, {
        updatefield
      }, {
        withCredentials:true
      });
      console.log("Update Response:", res.data);
      if (updateusername !== username) setUsername(updateusername);
      if (updateemail !== email) setEmail(updateemail);
      setIsEditing(false); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${URL_MAIN}/user/${userId}` , {
        withCredentials:true
      })
      localStorage.removeItem("userId")
      localStorage.removeItem("token")
      navigate("/signup")
    } catch (error) {
      console.error("Error deleting user data:", error)
    }
  }
  if (!user) {
    return <div>{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {error && (
        <div>
          <span>{error}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#21262d] rounded-lg p-6   transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col items-center">
                <img
                  src={
                    user.avatar_url ||
                    "https://gitpriv.s3.us-east-1.amazonaws.com/image.png" ||
                    "/placeholder.svg"
                  }
                  alt="Profile"
                  className="w-64 h-64 rounded-full object-cover mb-4"
                />
                <h1 className="text-2xl font-bold mb-1">{username}</h1>
                <h3>{email}</h3>
                <p className="text-gray-400 mb-4">{user.bio || "Backend Developer"}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                  <span>{followers.length} followers</span>
                  <span>•</span>
                  <span>{user.following || 0} following</span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-[#2d333b] border border-gray-700 rounded-md hover:bg-[#3a434b] transition-colors duration-300 mb-4"
                >
                  Edit profile
                </button>
              </div>
            </div>
            <div className="bg-[#161b22] rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h2>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Delete Account
                  </button>
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
                value={updateusername}
                placeholder={username}
                onChange={(e) => setupdateusername(e.target.value)}
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
                value={updateemail}
                placeholder={email}
                onChange={(e) => setupdateemail(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="bg-[#21262d] rounded-lg p-4 transform transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => {
                  setShowAllRepos(true)
                  setShowAllStars(false)
                  setShowAllFollowers(false)
                }}
              >
                <h3 className="text-gray-400">Repositories</h3>
                <p className="text-2xl font-bold mt-2">{repos.length}</p>
              </div>
              <div
                className="bg-[#21262d] rounded-lg p-4 transform transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => {
                  setShowAllRepos(false)
                  setShowAllStars(true)
                  setShowAllFollowers(false)
                }}
              >
                <h3 className="text-gray-400">Stars</h3>
                <p className="text-2xl font-bold mt-2">{stars}</p>
              </div>
              <div
                className="bg-[#21262d] rounded-lg p-4 transform transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => {
                  setShowAllRepos(false)
                  setShowAllStars(false)
                  setShowAllFollowers(true)
                }}
              >
                <h3 className="text-gray-400">Followers</h3>
                <p className="text-2xl font-bold mt-2">{followers.length}</p>
              </div>
            </div>

            {showAllRepos && (
              <div className="bg-[#161b22] rounded-lg p-6 mt-4">
                <h2 className="text-xl font-bold mb-4">All Repositories</h2>
                <div className="space-y-4">
                  {repos.map((repo) => (
                    <div
                      key={repo._id}
                      className="bg-[#21262d] p-4 rounded-lg cursor-pointer hover:bg-[#2d333b] transition-colors duration-300"
                    >
                      <Link to={`/repo-deaits/${repo._id}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-blue-400 font-medium hover:underline">{repo.reponame}</h3>
                          <p className="text-sm text-gray-400 mt-1">{repo.desc}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{repo.stars || 0} stars</span>
                          <span>{repo.forks || 0} forks</span>
                        </div>
                      </div></Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showAllStars && starsrepo.length > 0 && (
              <div className="bg-[#161b22]   rounded-lg p-6 mt-4">
                <h2 className="text-xl font-bold mb-4">Starred Repositories</h2>
                <div className="space-y-4">
                  {starsrepo.map((repo) => (
                    <Link to={`/repo-deaits/${repo._id}`} key={repo._id}>
                      <div
                        className="bg-[#21262d] p-4 mt-4 rounded-lg cursor-pointer hover:bg-[#2d333b] transition-colors duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-blue-400 font-medium hover:underline">
                              {repo.data.reponame || "Unnamed Repository"}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {repo.data.desc || "No description provided."}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{repo.stars || 0} stars</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}


            {showAllFollowers && (
              <div className="bg-[#161b22] rounded-lg p-6 mt-4">
                <h2 className="text-xl font-bold mb-4">Followers</h2>
                <div className="space-y-4">
                  {followers.map((follower) => (
                    <div key={follower.id} className="bg-[#21262d] p-4 rounded-lg flex items-center space-x-4">
                      <img
                        src={
                          follower.avatar_url ||
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EHDpqYq4MkBLDe35tokQz8UoBfZCxm.png"
                        }
                        alt={follower.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="text-gray-200">{follower.username}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile


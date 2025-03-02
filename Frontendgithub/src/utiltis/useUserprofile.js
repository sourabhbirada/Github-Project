import axios from "axios";
import { useEffect, useState } from "react"
import { PROFILE } from "./content";


const useUserprofile =  (userId) => {

    const [user , setuser ] = useState('');


    const fetchdata = async () => {

        const userdata = await axios.get(PROFILE+ userId,  { headers: {
        
            'Content-Type': 'application/json',
            
          },
          withCredentials: true
           });

        setuser(userdata.data)
    }

    useEffect(() => {
        fetchdata()
    }, [])


    return user;
}


export default useUserprofile;
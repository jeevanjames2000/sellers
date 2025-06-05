'use client'




import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function AuthVerify({children}) {
    const [userDetails,setUserDetails] = useState([]);
    const [token,setToken] = useState();
    const router = useRouter();
    const [loggedIn,setIsLoggedIn] = useState(false);
    useEffect(()=>{
        const userDetails = localStorage.getItem('userDetails');
        const token = localStorage.getItem('userToken');
        console.log(userDetails,"userDetails");
        if (!userDetails && !token ){
           
            router.push('/login');
        }
    },[]);

    return (
        <>
        {children}
        </>
    );



    
}

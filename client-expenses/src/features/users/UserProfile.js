import { useEffect, useRef, useState } from "react";
import { Link, useParams } from 'react-router-dom'
import { useGetUserByUsernameQuery, useEditUserMutation } from "./usersApiSlice";

import './UserProfile.css'

const UserProfile = () => {
  const { username } = useParams();
  const msgRef = useRef();
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
  })
  const [editUser] = useEditUserMutation();
  const [msg, setMsg] = useState('')

  const { 
    data: fetchUserData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetUserByUsernameQuery({
    username: username
  })

  useEffect(() => {
    if(isSuccess){
      setUserData(fetchUserData);
    }
  }, [isSuccess, fetchUserData])

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  const getRandomColor = () => {
    const colors = [
      '#aee39a', 
      '#1b511d', 
      '#54d7eb', 
      '#22577a', 
      '#21f0b6', 
      '#702cb4', 
      '#b69cfd', 
      '#3256c2', 
      '#67f059', 
      '#b31f59', 
      '#bce333', 
      '#604020', 
      '#fea53b', 
      '#67902f', 
      '#95bbef', 
      '#19a71f', 
      '#f73931', 
      '#f6a0ba', 
      '#a43e03', 
      '#f4d403']
    let colorIndex = getRandomColor.colorIndex || 0;
    const color = colors[colorIndex];

    getRandomColor.colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  const [backgroundColor, setBackgroundColor] = useState(getRandomColor())


  useEffect(() => {
    setBackgroundColor(getRandomColor());
  }, [])


  const handleChange = (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    setUserData(data => ({...data, [id]: value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if(!userData.email.includes('@')){
        setMsg('Not a valid email address.')
        return;
      } else if (
        userData.firstName.trim() === '' || 
        userData.lastName.trim() === '' || 
        userData.email.trim() === '' ){
          setMsg('Fields cannot be left blank.')
          return;
        }
      const response = await editUser({
        data: userData,
        username: username
      }).unwrap();
      setMsg('Your profile has been updated.')
      refetch()
    } catch (err){
      console.log(err)
    }
  }
  
  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = (
      <section className="user-profile">
        <h1>Edit Profile</h1>
          <div className="user-profile-header">
            <div className="user-profile-image" style={{ backgroundColor }}>
              <svg className="user-profile-initials" viewBox="0 0 100 100">
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle">
                  {getInitials(userData.firstName, userData.lastName)}
                </text>
              </svg>
            </div>
            <div className="user-profile-header-username">
              <label className="user-profile-label username-label">
              Username
              </label>
              <p className="user-profile-username">{userData.username}</p>
            </div>
          </div>

        <p ref={msgRef} className={msg? "msg" : "offscren"}aria-live="assertive">{msg}</p>  
        <form onSubmit={handleSubmit} className="user-profile-form">
          
          <br/>
          <label className="user-profile-label">
            First Name
          </label><br/>
            <input
              type="text"
              id="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="user-profile-input user-profile-first"
            />
            <br/>
          <label className="user-profile-label">
            Last Name
          </label><br/>
            <input
              type="text"
              id="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="user-profile-input user-profile-last"
            />
            <br/>
          <label className="user-profile-label">
            Email
          </label><br/>
            <input
              type="text"
              id="email"
              value={userData.email}
              onChange={handleChange}
              className="user-profile-input user-profile-email"
            />
            <br/>

          <button className="user-profile-save-btn">Save Changes</button>
        </form>
      </section>
    )
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }


  return content;
}

export default UserProfile;
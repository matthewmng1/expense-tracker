import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import UserProfile from './UserProfile';
import UserCategories from './UserCategories';
import UserPaymentMethods from './UserPaymentMethods';
import "./UserSettings.css"

const UserSettings = () => {

  const [displayContent, setDisplayContent] = useState("profile")

  let content; 
  content = (
      <div className='settings-container'>
        <div className='settings-nav-container'>
          <div className='settings-nav'>
            <nav>
              <NavLink className="nav-link" onClick={() => setDisplayContent("profile")}>
                Edit Profile
              </NavLink>

              <NavLink className="nav-link" onClick={() => setDisplayContent("categories")}>
                Edit Categories
              </NavLink>

              <NavLink className="nav-link" onClick={() => setDisplayContent("paymentMethods")}>
                Edit Payment Methods
              </NavLink>
            </nav>
            
          </div>
        </div>
          <div className='settings-content'>
            <h1 className='settings-content-h1'>Settings</h1>
            {displayContent === "profile" && 
            <UserProfile />}

            {displayContent === "categories" && 
            <UserCategories/>
            }

            {displayContent === 'paymentMethods' && 
            <UserPaymentMethods/>
            }
            
          </div>
      </div>
  )

  console.log(displayContent)
  return content;
}

export default UserSettings

// Left Side navigation
// Profile
// Edit Categories
// Edit Payment Methods

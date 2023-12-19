import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";

import logo from "../images/octopus-logo-white.png"
import "./LeftNavigation.css"

const LeftNavigation = () => {
  const user = useSelector(selectCurrentUser)
  
  if(user){
    return(
      <div className="left-nav-container">
        <div className="left-nav-img-container">
          <NavLink to={`/`}>
            <img src={logo}/>
          </NavLink>
        </div>
        <div className="left-nav">
          <nav>
            <NavLink className="nav-link" to={`${user}/overview`}>
              Overview
            </NavLink>

            <NavLink className="nav-link" to={`${user}/expenses`}>
              Expenses
            </NavLink>

            <NavLink className="nav-link" to={`${user}/monthly`}>
              Monthly Spending
            </NavLink>

            <NavLink className="nav-link" to={`${user}/settings`}>
              Settings
            </NavLink>
          </nav>
        </div>
      </div>
    )
  }
}

export default LeftNavigation
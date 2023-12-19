import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken } from "./authSlice";
import { Link } from "react-router-dom";
import UserExpenses from "../expenses/UserExpenses";

import "./Home.css"

const Home = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)

  const welcome = user ? `Welcome ${user}!` : 'Welcome!'

  const content = (
    <div>
      <div className="home-container">
        <div className="home-content">
          <h1>{welcome}</h1>  
          <UserExpenses/>
        </div>
      </div>
    </div>
  )
  
  return content;
}

export default Home

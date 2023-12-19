import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import logo from "../images/octopus-logo.png"
import "./Public.css"

const Public = () => {
  const user = useSelector(selectCurrentUser)
  const [form, setForm] = useState('login')
  const navigate = useNavigate();

  const toggleForm = (selectedForm) => {
    setForm(selectedForm)
  };
  
  const content = (

    <div className='public-wrapper'>
      <div className='public-left-container'>
      </div>

      <div className='public-right-container'>
        <img className='public-logo' src={logo}/>
        <div className='public-form-container'>
        <div className='public-form-toggle'>
            <h2
              onClick={() => toggleForm('login')}
              style={{
                textDecoration: form === 'login' ? "underline" : "",
                fontWeight: form === 'login' ? "450" : "200",
                color: form === 'login' ? "#A020F0" : "black"  
              }}
            >
              Login
            </h2>
            <h2
              onClick={() => toggleForm('register')}
              style={{
                textDecoration: form === 'register' ? "underline" : "",
                fontWeight: form === 'register' ? "450" : "200",
                color: form === 'register' ? "#A020F0" : "black"  }}
            >
              Register
            </h2>
          </div>
          <div className='public-form'>
            {form === 'login' ? 
              <div className='public-login-form-container'>
                <Login/> 
              </div>
              :               
              <div className='public-register-form-container'> 
                <Register/>
              </div>
            }
          </div>
        </div>
      </div>      
    </div>
  )

  if(user){
    navigate(`/${user}/overview`)
  } else {
    return content;
  }

}

export default Public;
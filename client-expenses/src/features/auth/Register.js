import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./authApiSlice";
import "./Form.css"

const Register = ({ onRegisterSuccess }) => {
  const userRef = useRef();
  const errRef = useRef();
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
  })
  const [errMsg, setErrMsg] = useState('')
  const [register, { registrationLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if(registerData.password !== registerData.confirmPassword) {
        setErrMsg("Password do not match.")
        setRegisterData({
          username: registerData.username,
          password: '',
          confirmPassword: '',
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
        })
        return
      } else if (registerData.password.length < 6){
        setErrMsg("Password must be at least 6 characters in length.")
        setRegisterData({
          username: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          email: '',
        })
        return
      } else {
        console.log(registerData)
        const newUserData = await register({...registerData}).unwrap()
        // console.log(newUserData)
        setRegisterData({
          username: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          email: '',
        })
        navigate('/login')
      }
    } catch (err) {
      console.log(err.status)
      if (err.status === 409) {
        setErrMsg('Username already in use.')
      } else if (err.status === 400) {
        console.log(registerData)
        console.log(err)
        setErrMsg('Invalid Email.')
      }
    }
  }

  const handleChange = async (e) => {
    e.preventDefault();
    const { id, value } = e.target;
    setRegisterData(data => ({...data, [id]: value}));
  }

  const content = registrationLoading ? <h1>Loading...</h1> : (
    <section className="register">
      <p ref={errRef} className={errMsg?"errmsg" : "offscren"}aria-live="assertive">{errMsg}</p>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-column">
            <label>Username</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              value={registerData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-column">
            <label>Password</label>
            <input
              type="password"
              id="password"
              value={registerData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-column">
            <label>First Name</label>
            <input
              type="text"
              id="firstName"
              value={registerData.firstName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>Last Name</label>
            <input
              type="text"
              id="lastName"
              value={registerData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-column">
            <label>Email</label>
            <input
              type="text"
              id="email"
              value={registerData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button className="btn">Register</button>
      </form>

    </section>
  )

  return content;
}

export default Register;
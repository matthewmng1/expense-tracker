import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"

import "./Form.css"

const Login = ({ registrationStatus }) => {
  const userRef = useRef()
  const errRef = useRef()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()


  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const userData = await login({username: user, password }).unwrap()
      // console.log(userData)
      dispatch(setCredentials({...userData, user: userData.username}))
      setUser('')
      setPassword('')
      navigate(`/${userData.username}/overview`)
    } catch (err) {
      if (!err?.originalStatus) {
        setErrMsg('No Server Response');
      } else if (err.originalStatus?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.originalStatus?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  }

  const handleUserInput = (e) => setUser(e.target.value)
  const handlePasswordInput = (e) => setPassword(e.target.value)

  const content = isLoading ? <h1>Loading...</h1> : (
    //display err message at top if error
    <section className="login">
      <p ref={errRef} className={errMsg?"errmsg" : "offscren"}aria-live="assertive">{errMsg}</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username </label>
          <input 
            type="text"
            id="username"
            ref={userRef}
            value={user}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label>Password </label>
          <input
            type="password"
            id="password"
            onChange={handlePasswordInput}
            value={password}
            required
          />
          <button className="btn">Login</button>
        </form>
    </section>
  )

  return content;
}

export default Login
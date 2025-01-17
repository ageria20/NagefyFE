/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button, Container, Form, Image, Spinner} from 'react-bootstrap'
import './Login.css'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import nagefyLogo from "../../assets/nagefyLogo200.png"
import { useAppDispatch } from '../../redux/store/store'
import { getStaffs } from '../../redux/actions/actionStaff'
import { notifyErr, url } from '../../redux/actions/action'
import { ToastContainer } from 'react-toastify'

const LoginStaff = () => {
const [showPassword, setShwPassword] = useState(false)
const [isLoading, setIsLoading] = useState<boolean>(false)
const [token, setToken] = useState("")
const navigate = useNavigate()
const dispatch = useAppDispatch()


const [user, setUser] = useState({
  email: "",
  password: ""
})

const toggleShowPassword = () => {
    setShwPassword(!showPassword)
}

const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
  e.preventDefault()

  try{
    setIsLoading(true)
    const resp = await fetch(`${url}/auth/staff-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });
    if(resp.ok){
      const res = await resp.json()
      localStorage.setItem("accessToken", res.accessToken)
      setToken(res.accessToken)
      navigate("/agenda")
    }
    else{
      notifyErr("Credenziali errate")
    }
  } catch (error) {
    
    console.log(error);
    
  } finally{
    setIsLoading(false)
  }
}

useEffect(() => {
  if(token){
 dispatch(getStaffs())
  }
 
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [token, dispatch])


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUser({...user, [e.target.name]: e.target.value})
}

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <Image src={nagefyLogo} alt="nageft_logo" />
    <Container className="m-3 shadow-lg container-custom rounded-4 p-0 d-flex justify-content-center align-content-center flex-column">
      <h3 className='p-3 text-center'><strong>Bentornato!</strong></h3>
      
      <Form className='loginForm mx-auto' onSubmit={handleSubmit}>
      <h3 className='p-3 text-center'><strong>STAFF</strong></h3>
        <Form.Group className="mb-3 p-1" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="name@example.com" autoFocus required onChange={handleChange}/>
        </Form.Group>
        <Form.Group className="p-1" controlId="exampleForm.ControlInput2">
          <Form.Label>Password</Form.Label>
          <div className='position-relative'>
          <Form.Control type={showPassword ? "text" : "password"} name="password" placeholder="Inserisci la password" required onChange={handleChange}/>
          
          <span
                className="password-toggle-icon"
                onClick={toggleShowPassword}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              >
          {showPassword ?<EyeSlashFill/> : <EyeFill/>}
          </span>
          </div>
        </Form.Group>
        <div className='p-3'>
        <Button type="submit" className="mb-3 mt-3 mx-auto">{isLoading ?  <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        /> : "Login"}</Button>
        </div>
        <div className='text-center'>
                Non hai ancora un account? <Link className="nav-link" to="/register"><strong>Registrati</strong></Link>
        </div>
      </Form>
    </Container>
    <ToastContainer/>
  </div>
  )
}

export default LoginStaff
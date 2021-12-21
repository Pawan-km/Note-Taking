import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Login = ({ showAlert }) => {
    const [credentials, setcredentials] = useState({ email: '', password: '' })

    let history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        })
        const json = await response.json()
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken)
            showAlert("Logged In Successfully", "success")
            history.push('/')
        } else {
            showAlert("Invalid email/password", "danger")
        }
        console.log(json)
    }

    const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='mt-2'>
            <h2>Login to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3" onSubmit={handleSubmit}>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login

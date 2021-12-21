import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = ({ showAlert }) => {
    const [credentials, setcredentials] = useState({ name: '', email: '', password: '', cpassword: '' })

    const { name, email, password } = credentials
    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:5000/api/auth/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
        const json = await response.json()
        // Save the auth token and redirect

        if (json.success) {
            console.log("working")
            localStorage.setItem('token', json.authtoken)
            showAlert("Account Created Successfully", "success")
            history.push('/')
        } else {
            showAlert("Invalid Credentials", "danger")
        }
    }

    const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='mt-2'>
            <h2>SignUp to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="emailHelp" name='name' onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup

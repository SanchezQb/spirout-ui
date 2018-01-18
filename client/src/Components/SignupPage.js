import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import helpers from '../openauth'
import Nav from './Layout/Nav'


class SignupPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: 0,
            message: ""
        }
    }

    addNewUser(newUser) {
        axios.request({
            method: 'post',
            url: 'http://localhost:5000/users/signup',
            data: newUser
        }).then(response => {
            if(response.data.status == 500) {
                helpers.setCookie(response.data.session_id)
                this.props.history.push('/')
            }
            else {
                this.setState({message: response.data.message, opacity: 1})
            }
            
        }).catch(err => console.log(err))
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            firstname: this.refs.first_name.value,
            lastname: this.refs.last_name.value,
            username: this.refs.username.value,
            email: this.refs.email.value,
            password: this.refs.password.value,

        }
        const validate = this.confirmPassword(this.refs.password.value, this.refs.password2.value)
        if(validate !== null) {
            this.addNewUser(newUser)
        }
        else {
            return (
                this.setState({
                    opacity: 1,
                    message: "Passwords do not match"
                })
            )
        }
    console.log("submitted") 
    }
    confirmPassword = (password, password2) => {
        if (password !== password2) {
            return null
        }
        else {
            return password
        }
    }

    render() {
        return (
            <section>
                <Nav />
                <form method="POST" onSubmit={this.handleSubmit}>
                    <h2>Signup</h2>
                    <div>
                        <label htmlFor="first_name">First Name</label><br />
                        <input id="first_name" type="text" ref="first_name" required/>
                    </div>
                    <div>
                        <label htmlFor="last_name">Last Name</label><br />
                        <input id="last_name" type="text" ref="last_name" required/>
                    </div>
                    <div>
                        <label htmlFor="email">Email Address</label><br />
                        <input id="email" type="email" ref="email" required/>
                    </div>
                    <div>
                        <label htmlFor="username">Username</label><br />
                        <input id="username" type="text" ref="username" required/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label><br />
                        <input id="password" type="password" ref="password" required/>
                    </div>
                    <div>
                        <label htmlFor="password2">Confirm Password</label><br />
                        <input id="password2" type="password" ref="password2" required/>
                    </div>
                    <div>
                        <button type="submit">Sign Up</button>
                    </div>
                    <div>
                        <p>Already have an account? Log in <Link to="/login"><span>here</span></Link></p>
                    </div>
                    <div className="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
                        {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}>  x </span> 
                    </div>
                </form>
            </section>
        )
    }
}

export default SignupPage
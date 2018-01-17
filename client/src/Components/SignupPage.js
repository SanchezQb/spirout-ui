import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import helpers from '../openauth'


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
            <div className="login-form">
                <h5>Sign Up</h5>
                 <div className="row">
                    {/* <form className="col s12" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="input-field col s6">
                            <input id="first_name" type="text" className="validate" name="first_name" ref="first_name"/>
                            <label htmlFor="first_name">First Name</label>
                            </div>
                            <div className="input-field col s6">
                            <input id="last_name" type="text" className="validate" name="last_name" ref="last_name"/>
                            <label htmlFor="last_name">Last Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                            <input id="username" type="text" className="validate" name="username" ref="username"/>
                            <label htmlFor="username">Username</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                            <input id="email" type="email" className="validate" name="email" ref="email"/>
                            <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                            <input id="password" type="password" className="validate" name="password" ref="password"/>
                            <label htmlFor="password">Password</label>
                            </div>
                            <div className="input-field col s6">
                            <input id="password2" type="password" className="validate" name="password2" ref="password2"/>
                            <label htmlFor="password2">Confirm Password</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                            <button className="waves-effect waves-light" type="submit">Sign Up</button>
                            </div>
                            <div className="col s6">
                            <p className="existing">Already a user? <span className="existing-span"><Link to="/login">Log in here</Link></span></p>
                            </div>
                        </div>
                        <div style={{opacity: this.state.opacity, color: 'red'}}>
                            {this.state.message}
                        </div>
                        </form> */}
<form onSubmit={this.handleSubmit}>
  <div class="form-group">
    <label for="exampleInputEmail1">Firstname</label>
    <input type="text" class="form-control" id='descriptionx' ref='first_name'/>
  </div>

  <div class="form-group">
    <label for="exampleInputPassword1">Lastname</label>
    <input type="text" class="form-control " id='descriptionx' ref='last_name'/>
  </div>

  <div class="form-group">
    <label for="exampleInputPassword1">Username</label>
    <input type="text" class="form-control"id='descriptionx' ref='username' />
  </div>

  <div class="form-group">
    <label for="exampleInputPassword1">email</label>
    <input type="email" class="form-control" id='descriptionx' ref='email' />
  </div>

  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id='descriptionx' ref='password' />
  </div>

  <div class="form-group">
    <label for="exampleInputPassword1"> Confirm Password</label>
    <input type="password" class="form-control" id='descriptionx' ref='password2' />
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
  <div class="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
                            {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}>  x </span> 
                        </div>
                
</form>
                </div>
            </div>
        )
    }
}

export default SignupPage
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import helpers from '../openauth'

class LoginPage extends Component {
    constructor(props) {
        super(props) 
            this.state = {
                opacity: 0,
                message: ""
            
        }
    }

componentDidMount () {
    helpers.logger()
}

    logUserIn(newUser) {
        axios.request({
            method: 'post',
            url: 'http://localhost:5000/users/login',
            data: newUser
        }).then(response => {
            if(response.data.status == 500) {
                helpers.setCookie(response.data.session_id)
                this.props.history.push('/')
            }
            
            else this.setState({message: response.data.message, opacity: 1})

        }).catch(err => console.log(err))
    }


    handleSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            username: this.refs.username.value,
            password: this.refs.password.value,


        }
        this.logUserIn(newUser)
        
    }

    render() {
        return (
            <div className="login-form">
                <h5>Log In</h5>
                <form method="POST" onSubmit={this.handleSubmit}>
                <div className="row">
                <div class="form-group">
    <label for="exampleInputPassword1"> Username</label>
    <input type="text" class="form-control" id='descriptionx' ref='username' />
  </div>
                </div>
                <div class="form-group">
        <label for="exampleInputPassword1"> Password</label>
        <input type="password" class="form-control" id='descriptionx' ref='password' />
     </div>
            
                    <button className="btn"type="submit">Login</button>
                    <div className="row">
                        <div className="form-group col sm-6">
                            <p className="existing-span"><Link to>Forgot password</Link></p>
                        </div>
                        <div className="form-group col sm-6">
                            <p className="existing">Or Register <span className="existing-span"><Link to="/signup">here</Link></span></p>
                        </div>
                    </div>
                    <div class="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
                            {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}>  x </span> 
                        </div>
            
                </form>
            </div>
        )
    }
}

export default LoginPage
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import helpers from '../openauth'
import Nav from './Layout/Nav'

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
            <div>
                <Nav />
                <section>
                    <form method="POST" onSubmit={this.handleSubmit}>
                        <h2>Login</h2>
                        <div>
                            <label htmlFor="username">Username</label><br />
                            <input id="username" type="text" ref="username"/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label><br />
                            <input id="password" type="password" ref="password"/>
                        </div>
                        <div>
                            <button type="submit">Log in</button>
                        </div>
                        <div className="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
                            {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}></span> 
                        </div>
                        <div>
                            <p>Don't have an account yet? Register <Link to="/signup"><span>here</span></Link></p>
                        </div>
                        
                    </form>
                </section>
            </div>
            
        )
    }
}

export default LoginPage


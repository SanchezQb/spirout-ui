import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import helpers from '../../openauth'
import axios from 'axios'
import { withRouter } from 'react-router-dom'


class Nav extends Component {
    constructor() {
        super()
        this.state = {
            status: "Login/Signup", 
            user: null, 
            access: 'jbsjjbb'
        }
    }
    

    componentWillMount() {
    var access = helpers.readCookie('sessionid')
    console.log(access)
    if(access == null) {
        console.log(access)
    }
    else {
        
        this.setState({
            status: "Logout", 
            access: access
        })
        // this.destroycookie()
    }
    }

    componentDidMount() { 
        axios.get(`http://localhost:5000/${this.state.access}/user`)
        .then(response => { 
            if(response.data.status == 500){ 
                this.setState({ user: response.data.currentuser.username})
            } else { 
                this.setState({ user: null})
            }
        })
    }

    destroycookie = () => { 
        document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
    navigate = () => {
        if(this.state.status === "Login/Signup") {
            this.props.history.push('/login')
        }
        else {
           var access =  helpers.readCookie("sessionid")
           axios.get(`/${access}/logout`)
           .then(response => {
               if(response.data.status == 500) {
                   this.setState({
                       status: "Login/Signup"
                   })
                   document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                   this.props.history.push('/login')
               }
               else {

               }
           })
        }
    }

    render() {
        return (
            <div>
                <Link to="/pay">
                <svg id="i-cart" className="cart-icon" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M6 6 L30 6 27 19 9 19 M27 23 L10 23 5 2 2 2" />
                    <circle cx="25" cy="27" r="2" />
                    <circle cx="12" cy="27" r="2" />
                </svg>
                </Link>
                <nav>
                    <div className="logo"></div>
                    <Link to="/">Home</Link> 
                    <a href="#">How it works</a> 
                    <a href="#"  onClick={() => this.navigate()}>{this.state.status}</a>
                    <a></a> 
                    <Link to="/pay">
                    <svg id="i-cart" viewBox="0 0 32 32" width="20" height="20" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M6 6 L30 6 27 19 9 19 M27 23 L10 23 5 2 2 2" />
                        <circle cx="25" cy="27" r="2" />
                        <circle cx="12" cy="27" r="2" />
                    </svg>
                    </Link>
                </nav>
            </div>
           
        )
    }
}
export default withRouter(Nav)
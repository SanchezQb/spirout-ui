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
               }
               else {

               }
           })
        }
    }

    openNav = () => {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px" }
    
     closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0"; };
    
    render() {
        return (
            <div>
              
                {/* <div className="nav-wrapper">
                <a href="" data-activates="main-menu" onClick={() => this.openNav()}className="nav-item button-collapse show-on-large"><i className="fa fa-bars"></i></a>
                <div className = "spirout">
                    <Link to="/"><img src="/img/icons-01.png" alt="logo" /></Link>
                </div>
                <ul className="navbar-nav right">
                    <li><Link to="/upload"><i className="nav-item nav-link fa fa-upload"></i></Link></li>
                    <li className="nav-item nav-link login-nav" onClick={() => this.navigate()}>{this.state.status}</li>
                    <li className='nav-item nav-link'><Link to="/search"><i className="fa fa-search"></i></Link></li>
                </ul> */}
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#"><div className='spirout'><img src="/img/icons-01.png" alt="logo" /></div></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/upload">Upload</a>
      </li>
      <li class="nav-item ml-auto">
        <a class="nav-link" href="#">Logged in as {this.state.user}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>
</nav>
                {/* <ul className="side-nav" id="main-menu"> */}
                    {/* <ul id="mySidenav" className="sidenav"> 
                    <div className="menu">
                    <h6>MENU</h6>
                    <h6 className="close" onClick={() => this.closeNav()}>X</h6>
                    </div>
                    <li id='navlistx'><Link to="/upload">Upload Content</Link></li>
                    <li id='navlistx'><Link to="/upload">Request Content</Link></li>
                    <li id='navlistx'><a href="badges.html">Logout</a></li>
                    <li id='navlistx'><Link to="/about">About Spirout</Link></li>
                </ul> */}
                </div>
           
        )
    }
}
export default withRouter(Nav)
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
            <footer class="page-footer">
                    <div class="container">
                        <div class="row">
                        <div class="col l6 s12">
                            <h5 class="white-text">Spirout</h5>
                            <p class="grey-text text-lighten-4">Tailored content for your business</p>
                        </div>
                        <div class="col l4 offset-l2 s12">
                            <h5 class="white-text">Quick Links</h5>
                            <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    <div class="footer-copyright">
                        <div class="container">
                        © 2018 Copyright
                        </div>
                    </div>
                    </footer>
        )
    }
}

export default Footer
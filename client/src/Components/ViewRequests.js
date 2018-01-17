import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import SingleRequest from './SingleRequest';

class ViewRequests extends Component {
    render() {
        return (
            <div>
                <ul className="collection">
                    <li className="collection-item avatar">
                    <Link to="/signup">
                    <i className="fa fa-location-arrow circle"></i>
                    <span className="title request">Title</span>
                    <p className="request">First Line <br/>
                        Second Line
                    </p>
                    </Link>
                    </li>
                
                </ul>
            </div>
        )
    }
}

export default ViewRequests
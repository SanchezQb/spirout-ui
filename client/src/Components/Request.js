import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Request extends Component {
    render() {
        return (
            <div className="login-form">
                <h5>Request Content</h5>
                 <div className="row">
                    <form className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                            <input id="topic" type="text" className="validate"/>
                            <label htmlFor="topic">Topic</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                            <input id="words" type="number" className="validate"/>
                            <label htmlFor="words">Number of words</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="category" type="text" className="validate"/>
                                <label htmlFor="category">Category</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="duration" type="text" className="validate"/>
                                <label htmlFor="duration">Duration</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="content-type" type="text" className="validate"/>
                                <label htmlFor="content-type">Type of Contnet</label>
                            </div>
                        </div>
                        <div className="row">
                            <div class="input-field col s12">
                                <textarea id="description" className="materialize-textarea" data-length="120"></textarea>
                                <label htmlFor="description">Description</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                            <button className="waves-effect waves-light" type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Request
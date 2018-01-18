import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Nav from './Layout/Nav'

class Request extends Component {
    render() {
        return (
            <section>
                <Nav />
                <form>
                    <h2>Request Content</h2>
                    <div>
                        <label for="topic">Topic</label><br />
                        <input id="topic" type="text"/>
                    </div>
                    <div>
                        <label for="description">Description</label><br />
                        <textarea></textarea>
                    </div>
                    <div>
                        <label for="category">Category</label><br />
                        <select>
                            <option disabled>Please select category</option>
                            <option>Society</option>
                            <option>Social Media</option>
                            <option>Health and Lifestyle</option>
                            <option>Science</option>
                            <option>Fashion</option>
                            <option>Relationship</option>
                        </select>
                    </div>
                    <div>
                        <label for="words">Number of words</label><br />
                        <input id="words" type="number"/>
                    </div>
                    <div>
                        <label for="type">Content Type</label><br />
                        <select>
                            <option disabled>Please select content type</option>
                            <option>Written</option>
                            <option>Visual</option>
                        </select>
                    </div>
                    <div>
                        <label for="duration">Duration</label><br />
                        <input id="duration" type="text"/>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </section>
        )
    }
}

export default Request
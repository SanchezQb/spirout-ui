import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import Nav from './Layout/Nav'


class Category extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            categories: []
        }
    }
    componentDidMount = () => {
        this.fetchCategories()
    }
    fetchCategories = () => {
       axios.get('http://localhost:5000')
       .then(response => this.setState({
           categories: response.data.categories
       }))
    }

    navigate = (id) => { 
        this.props.history.push(`/category/${id}`)
    }

    render() {
        const categories = this.state.categories.map((category) => {
            return (
                <div className='col md-4'> 
                <div class="card row-image" onClick={() => this.navigate(category._id)} style={{width: 17 + 'rem'}}>
                <img class="card-img-top img-fluid" id='image-caption' src={category.icon_url} alt="Card image cap"/>
                <div class="card-body">
                  <h5 class="card-title">{category.name}</h5>
            
                </div>
              </div>
              </div>
            )
        })
        return (
            <div>
                <Nav />
                <section id="main">
                        <div className="banner">
                            <h1>Buy and sell your content securely</h1>
                            <a href="#categories" className="start">Buy Content</a>
                            <a href="#" className="start">Sell Content</a>
                        </div>
                </section>
            </div>
        )
    }
}
export default Category
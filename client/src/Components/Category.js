import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import banner from '../banner.jpg'
import banner2 from '../banner2.jpg'


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
            <div className="category" id='category'>
                 {/* <div class="carousel carousel-slider">
                    <a class="carousel-item" href="#one!"><img src={banner}/></a>
                    <a class="carousel-item" href="#two!"><img src={banner2}/></a>
                </div> */}
                <div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel">
                <div id='overlay'></div>
                <div className='centered'>
              <h3> Upload your content and get paid </h3>
              </div> 

        <div class="carousel-inner">
     <div class="carousel-item active">
        <img class="d-block w-100" src={banner} alt="First slide"/>
     </div>
    <div class="carousel-item">
      <img class="d-block w-100" src={banner2} alt="Second slide"/>
    </div>
  </div>
</div>
                    {/* <div className='jumbo'>
                        <div className='caption'>
                            <h5 id='main-text'> Create. Upload. Get Paid </h5>
                            <h6 className='signature'> Sign up, share your content with the world and  get paid </h6>
                             </div> 
                     </div>  */}
                <div className="main">
                    <h4>Content Categories</h4>
                </div>
                <div className="container">
                    <div className="row row-cards">
                        
                            {categories}
                       
                    </div>
                </div>
                
            </div>
        )
    }
}
export default Category
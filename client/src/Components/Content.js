import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import helpers from '../openauth'


class Content extends Component {
    constructor() {
        super()
        this.state = {
            content: [],
            contentx: {}, 
            category_name: "",
            session: "", 
            clicked: [], 
            message: '', 
            opacity: 0
        }
    }
    componentDidMount() {
        var access = helpers.readCookie("sessionid")
        console.log(access)
        this.setState({
            session: access
        })
        console.log('hello')
        axios.get(`http://localhost:5000/category/${this.props.match.params.id}`)
        .then(response => {
            if(response.data.status == 500) {
                this.setState({
                    content: response.data.content,
                    category_name: response.data.category.name
                })
            }
        })
    }
    addtoCart = (content_id) => {
        console.log('clieck e')
        axios.get(`http://localhost:5000/addtocart/${this.state.session}/${content_id}`)
        .then(response => {
            if (response.data.status == 500) {
                //handle success
                var clicked = this.state.clicked
                clicked.push(content_id)
                this.setState({ clicked: clicked, message: 'Added to cart', opacity: 1})
            }
            else {
                //handle error
                this.setState({ message: response.data.message, opacity:  1})
            }
        })
    }
    render() {
            let contents
            if(this.state.content.length > 0){ 
                contents = this.state.content.map(content => { 
                    return (
                        <div className="col md-4 card-tinng" key={content._id}>
                            <div class="card row-image" onClick={() => { this.setState({ contentx: content})}} style={{width: 18 + 'rem'}} data-toggle="modal" data-target="#exampleModalCenter">
  
        <div class="card-body">
        <h5 class="card-title">{content.name}</h5>
        <p class="card-text">N{content.price}</p>
     </div>
    <ul class="list-group list-group-flush">
    <li class="list-group-item">{content.cre}</li>
        <li class="list-group-item">Buy</li>
        </ul>
</div>
                        </div>
                    )
                })
            } else { 
                contents = (
                    <div> Oops this category doesnt have any content </div>
                )
            }

        return (
            <div className="content">
             <div class="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
                            {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}>  x </span> 
                        </div>
                <div className="container">
                    <div className="main">
                
                    </div>
                </div>
                
                <div className="container">
                    <div className="row row-cardsx">
                        {contents}
                    </div>
                </div>
                
                <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">{this.state.contentx.name}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>{this.state.contentx.description} </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onClick={() => this.addtoCart(this.state.contentx._id)}>Add to Cart</button>
      </div>
    </div>
  </div>
</div>

            </div>
        )
    }
}

export default Content;
import React, { Component } from 'react'
import helpers from '../openauth'
import axios from 'axios'
import Nav from './Layout/Nav'


class Upload extends Component {
    constructor() {
        super()
        this.state = {
            currentUser: {

            },
            session: "",
            opacity: 0,
            message: "", 
            categories: []
        }
    }
    componentWillMount() {
        axios.get('http://localhost:5000/')
      .then(response => { 
          this.setState({ categories: response.data.categories})
      })
    }
    componentDidMount = () => {
    
      var access = helpers.readCookie("sessionid")
      this.setState({
          session: access
      })
      setTimeout(this.checkCategory(), 1000)
      
    }

    checkCategory = () => { 
        if(this.state.categories.length > 0){ 

        } else { 
            axios.get('http://localhost:5000/')
            .then(response => { 
                this.setState({ categories: response.data.categories})
            }) 
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.session == "") {
            //user has to be logged in
        }
        else {
            const bodyFormData = new FormData()
            bodyFormData.set('name', this.refs.name.value)
            bodyFormData.set('category_name', this.refs.category.value)
            bodyFormData.set('type', this.refs.type.value)
            bodyFormData.set('file', this.refs.file.files[0])
            bodyFormData.set('description', this.refs.description.value)
            bodyFormData.set('price', this.refs.price.value)
            console.log(this.refs.file.files[0])
            const myurl =  `http://localhost:5000/${this.state.session}/content/upload`
            axios({
                method: 'POST',
                url: myurl,
                data: bodyFormData,
                config: {headers: {'Content-Type': 'multipart/form-data'}}

            })
            .then(response => {
                if(response.data.status !== 500) {
                    this.setState({
                        opacity: 1,
                        message: response.data.message
                    })
                }
                else {
                    console.log("Success")
                    //handle success here
                    this.props.history.push('/')
                }
            })
        }
    }

    render() {
        let  content 
            if(this.state.categories.length > 0){ 
                content = this.state.categories.map(category => { 
                    return ( 
                        <option value={category.name}>{category.name}</option>  
                    )
                })
            } else { content = null}

        return (
            <section>
                <Nav />
                <form>
                    <h2>Upload Content</h2>
                    <div>
                        <label for="topic">Topic</label><br />
                        <input id="topic" type="text" ref="name" required/>
                    </div>
                    <div>
                        <label for="description">Description</label><br />
                        <textarea ref="description" required></textarea>
                    </div>
                    <div>
                        <label for="category">Category</label><br />
                        <select ref="category">
                            <option disabled>Please select category</option>
                            { content }
                        </select>
                    </div>
                    <div>
                        <label for="price">Price</label><br />
                        <input id="price" type="number" ref="price" required/>
                    </div>
                    <div>
                        <label for="type">Content Type</label><br />
                        <select ref="type">
                            <option disabled>Please select content type</option>
                            <option>Written</option>
                            <option>Visual</option>
                        </select>
                    </div>
                    <div>
                        <label for="file">Upload file</label><br />
                        <input id="file" type="file" ref="file" required />
                    </div>
                    <div>
                        <button type="submit">Upload</button>
                    </div>
                    <div className="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
                        {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}>  x </span> 
                    </div>
                </form>
            </section>
            
        )
    }
}

export default Upload
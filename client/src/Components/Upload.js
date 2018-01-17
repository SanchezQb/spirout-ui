import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import helpers from '../openauth'
import axios from 'axios'


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
            <div className='container' id='form-ting'>
            <div style={{ marginBottom: 30 + 'px', marginLeft: 50 + 'px'}}><h3> Upload Content </h3> </div>
    <form method="POST" onSubmit={this.handleSubmit}>
  <div class="form-group">
    <label for="exampleInputEmail1">Topic</label>
    <input type="text" class="form-control" ref='name'/>
  </div>

  <div class="form-group">
    <label for="exampleInputPassword1">Description</label>
    <input type="text" class="form-control" id='description' ref='description'/>
  </div>

  <div class="form-group">
    <label for="exampleInputPassword1">Price</label>
    <input type="number" class="form-control" ref='price' />
  </div>

  
  <div class="form-group">
    <label for="exampleFormControlSelect1">Category</label>
    <select class="form-control" id="exampleFormControlSelect1" ref='category'>
     {content}
    </select>
  </div>

  <div class="form-group">
    <label for="exampleFormControlSelect1">Type</label>
    <select class="form-control" id="exampleFormControlSelect1" ref='type'>
            <option>Written </option>
            <option> Visual </option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleFormControlFile1"></label>
    <input type="file" class="form-control-file" id="exampleFormControlFile1" ref='file'/>
  </div>

  <button type='submit'class="btn btn-primary">Submit</button>
</form>
<div class="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
                            {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}>  x </span> 
                        </div>
                </div>
            
        )
    }
}

export default Upload
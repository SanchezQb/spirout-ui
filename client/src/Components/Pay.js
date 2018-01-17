import React, { Component } from 'react';
import helpers from '../openauth'
import PaystackButton from 'react-paystack';
import axios from 'axios'

export default class Pay extends Component {
    state = {
        session: "",
        key: "pk_live_7172777765e8e0fa2e80de871f3196a57d150323", //PAYSTACK PUBLIC KEY
        email: "",  // customer email
        amount: 0, //price,
        cart: [],
        user: "", 
        opacity: 0
    }
  

  componentWillMount = () => {
    var access = helpers.readCookie("sessionid")
    console.log(access)
    this.setState({
        session: access
    })
    console.log(access)
    axios.get(`http://localhost:5000/${access}/user`)
    .then(response => { 
      if(response.data.status == 500){ 
        this.setState({ email: response.data.currentuser.email})
      } else { 
        console.log('nothing here')
      }
    })
  }
   hashCode = (str) => {
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash;}
    return hash;}

   componentDidMount = () => {
    axios.get(`http://localhost:5000/${this.state.session}/cart`)
    .then(response => {
      if(response.data.status == 500) {
        response.data.cart.map(content => {
          this.setState({amount: ((this.state.amount + content.price))})
        })
        
        this.setState({
          cart: response.data.cart, amount: this.state.amount*100, user: response.data.currentuser
        })
        console.log(this.state.amount)
        console.log(this.state.cart)
        // setTimeout(this.callback(), 50000)  
      }
      else {
        console.log(response.data.message)
      }
    })
   }

   removeFromCart = (content_id) => {
    console.log('called me')
     axios.get(`http://localhost:5000/removefromcart/${this.state.session}/${content_id}`)
     .then(response => { 
       if(response.data.status == 500){
        this.refresh()
      } else {
        console.log(response.data.message)
      } 
       
     })
   }

   refresh = () => { 
    axios.get(`http://localhost:5000/${this.state.session}/cart`)
    .then(response => {
      if(response.data.status == 500) {
        response.data.cart.map(content => {
          this.setState({amount: this.state.amount + content.price})
        })
        this.setState({
          cart: response.data.cart
        })
        console.log(this.state.amount)
        console.log(this.state.cart)

        
      }
      else {
        console.log(response.data.message)
      }
    })
   }

  
serialize = (array) => {
let url = '?'
array.forEach(array => {
  url = url +  ('&cods[]=' + array)
 return url
})

return url
}

    callback = (response) => {
        console.log(response); // card charged successfully, get reference here
        var position = 0
        var array = this.state.cart.map(content => {
          var cart2 = []
          cart2.push(content._id)
          return cart2
        })
        var cod = array[0]
        console.log(position)
        console.log(cod)
        var hash = `${this.state.user}${cod}idontloveyoulikekanyeloveskanye`
        console.log(hash)
        var auth = this.hashCode(hash)
        console.log(auth)
        var query_array = this.serialize(array)
        var url = `http://localhost:5000/bulk/mail/content${query_array}&uid=${this.state.user}&position=${position}&authKey=${auth}`
       axios.get(url)
       .then(response => { 
         if(response.data.status == 500){ 
           console.log('check your mail')
         } else { 
           console.log(response.data.message)
         }
       })
    }

    close = () => {
        console.log("Payment closed");
    }

    getReference = () => {
        //you can put any unique reference implementation code here
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

        for( let i=0; i < 15; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

  render() {
    let contents
    
    if(this.state.cart.length > 0){ 
        contents = this.state.cart.map(content => { 
            return (
                <div className="col md-4 card-tinng" key={content._id}>
                    <div class="card row-image" style={{width: 18 + 'rem'}}>

    <div class="card-body">
    <h5 class="card-title">{content.name}</h5>
   <p class="card-text">N{content.price}</p>
   </div>
  <ul class="list-group list-group-flush">
  <li onClick={() => this.removeFromCart(content._id)}class="list-group-item hover-button" >Remove from cart</li>

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
      <div className="container">
          <div className="row">{contents}</div>   
        <p>
          <PaystackButton
            text="Make Payment"
            className="payButton"
            callback={this.callback}
            close={this.close}
            reference={this.getReference()}
            email={this.state.email}
            amount={this.state.amount}
            paystackkey={this.state.key}
          />
        </p>
        <button onClick={() => this.callback()}> Get </button>
        <div class="alert alert-danger" role="alert" style={{opacity: this.state.opacity, color: 'red'}}>
            {this.state.message} <span style={{float: 'right'}} onClick={() => { this.setState({opacity: 0})}}>  x </span> 
        </div>
      </div>
    );
  }
}

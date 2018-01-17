import React, { Component } from 'react';
import Nav from './Components/Layout/Nav'
import './App.css';
import Main from './Components/Main';
import Footer from './Components/Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { render } from '@testing-library/react';

function App() {  
  constructor(props){
    super(props);
    this.state ={
      imageURL: '',
    }
  }
  componentDidMount(){
    axios.get('https://dog.ceo/api/breeds/image/random')
    .then(response=>{
      this.setState({ imageURL: response.data.message });
    })
    .catch(error=>{
      console.log(error);
    });
  }
  render(){
    const { imageURL } = this.state;
  return (
    <div className="App">
      <header className="App-header">
        <img src={imageURL} />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
  }
}

export default App;

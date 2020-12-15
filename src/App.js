import React, {Component} from 'react';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition' 
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import 'tachyons';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import { render } from '@testing-library/react';


const particleOptions = {
  particles: {
      number: {value : 100, density : { enable: true, value_area: 800}}
}
}

const app = new Clarifai.App({
  apiKey: '1671dc52247642daa536e4c5ec8a28a2'
 });


class App extends Component {
  
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }


x

  onInputChange = (event) => {
      this.setState({input : event.target.value})
  }
  
  onButtonSubmit = () => {
      this.setState({imageUrl : this.state.input})
      app.models
      .initModel({
        id: Clarifai.FACE_DETECT_MODEL,
      })
      .then((model) => {
        return model.predict(
          this.state.input
        );
      })
      .then((response) => {
        console.log(response);
      });
  } 


  render(){ 
    return (
      <div className="App">
        <Particles className = 'particles' 
            params={particleOptions} />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm  onButtonSubmit = {this.onButtonSubmit} onInputChange = {this.onInputChange}/>
          <FaceRecognition imagePrediction = {this.state.imageUrl}/>
      </div>
    );
        }
}

export default App;

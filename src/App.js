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
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register'
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
      imageUrl: '',
      box: {},
      route: 'SignIn',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    /*console.log(box);*/
    this.setState({box: box})
  }

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
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => this.setState({box: {}})); //my own improvement
  } 


  onRouteChange = (route) => {
    if (route === 'SignIn' || route === 'Register'){
      this.setState({isSignedIn : false})
    } else if (route === 'Home'){
      this.setState({isSignedIn : true})
    }
    this.setState({route: route})
  }



  render(){ 
    return (
      <div className="App">
        <Particles className = 'particles' 
            params={particleOptions} />
          <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
          { this.state.route ==='Home' 
            ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm onButtonSubmit = {this.onButtonSubmit} onInputChange = {this.onInputChange}/>
            <FaceRecognition box = {this.state.box} imagePrediction = {this.state.imageUrl}/>
          </div>
            : (
              this.state.route ==='SignIn'
              ? <SignIn onRouteChange = {this.onRouteChange} />
              : <Register onRouteChange = {this.onRouteChange} />
            )
          }     
      </div>
    );
        }
}

export default App;

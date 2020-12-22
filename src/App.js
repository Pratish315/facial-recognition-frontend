import React, {Component} from 'react';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition' 
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import 'tachyons';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register'
//import { render } from '@testing-library/react';


const particleOptions = {
  particles: {
      number: {value : 100, density : { enable: true, value_area: 800}}
}
}




const inialState = 
  {
    input: '',
    imageUrl: '',
    box: {},
    route: 'SignIn',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      password: '',
      entries: 0,
      joined : 'new Date()'
    }
  }


class App extends Component {

  constructor(){
    super();
    this.state = inialState;
  }

  loadUser = (data) => {
    this.setState(
      {user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined : data.joined
       } }
    )
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
      fetch('https://warm-caverns-83731.herokuapp.com/imageurl', {
        method : 'post',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({
        input : this.state.input
        })
      })
      .then(response => response.json())
      .then((response) => {
        if (response){
          fetch('https://warm-caverns-83731.herokuapp.com/image', {
            method : 'put',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({
                id : this.state.user.id
            })
        })
            .then(response => response.json())
            .then(count => {
                this.setState(Object.assign(this.state.user, {entries : count}))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => this.setState({box: {}})); //my own improvement
  } 


  onRouteChange = (route) => {
    if (route === 'SignIn' || route === 'Register'){
      this.setState(inialState)
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
            <Rank name = {this.state.user.name} entries = {this.state.user.entries} />
            <ImageLinkForm onButtonSubmit = {this.onButtonSubmit} onInputChange = {this.onInputChange}/>
            <FaceRecognition box = {this.state.box} imagePrediction = {this.state.imageUrl}/>
          </div>
            : (
              this.state.route ==='SignIn'
              ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
              : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
            )
          }     
      </div>
    );
        }
}

export default App;

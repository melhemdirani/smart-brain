import React, { useState, useEffect} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const App = () => {
  
  const [input, setInput]=useState("")
  const [imageUrl, setImageUrl]=useState("")
  const [box, setBox]=useState({})
  const [route, setRoute]=useState("signin")
  const [isSignedIn, setIsSignedIn]=useState(false)
  const [user, setUser]=useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  })
  
 
  const loadUser = (data) => {
    setUser( {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box)
  }

  const onInputChange = (event) => {
    setInput(event.target.value)
  }

  const onButtonSubmit = () => {
    setImageUrl(input)
    fetch('https://secret-lake-91204.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: input
      })
    })
    .then(response => response.json())
      .then(response => {
        if (response === "missing"){
          return alert("Please enter a URL!")
        }
        if (response === "wrong"){
          return alert("Please enter proper a URL!")
        }
        if (response) {
          fetch('https://secret-lake-91204.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(response => {
              response.json()
              .then(count => {
                setUser({  
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  entries: count,
                  joined: user.joined
                })
              })
            })
            .catch(console.log)
        }
        displayFaceBox(calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setBox({})
      setInput("")
      setImageUrl("")
      setIsSignedIn(false)
      setUser({
        id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
      })
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route)
  }
  
  return (
    <div className="App animate">
        <Particles className='particles'
        params={particlesOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === 'home'
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/> 
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
            
          </div>
        :  route === 'signin' || route === 'signout' ?
        <Signin onRouteChange={onRouteChange} loadUser={loadUser}/>
        : (
            route === 'isSignedIn'
            ? <Signin loadUser={loadUser} onRouteChange={onRouteChange} /> 
            : <Register  loadUser={loadUser} onRouteChange={onRouteChange}/>
          )
      }
    </div>
  );
}

export default App;

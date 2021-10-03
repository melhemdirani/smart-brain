import React, {useState} from 'react';

const Signin = ({loadUser, onRouteChange}) => {

  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const onEmailChange = (event) => {
    setSignInEmail(event.target.value)
  }

  const onPasswordChange = (event) => {
    setSignInPassword(event.target.value)
  }

  const onSubmitSignIn = () => {
    fetch('https://secret-lake-91204.herokuapp.com/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(response => response.json())
      .then(user => {
        if(user.id){ // does the user exist? Did we receive a user with a property of id?
          loadUser(user);
          onRouteChange('home');
        } else{
          alert("Please enter the right sign in credentials or register if you haven't already!")
        }
      })
  }

  return (
    <form className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center" onSubmit={onSubmitSignIn}>
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange= {onEmailChange}
                required
              />
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange= {onPasswordChange}
                required
              />
          </fieldset>
          <div className="">
            <p className="f6 link dim black db pointer" onClick={onSubmitSignIn}>Sign in</p>
          </div>
          <div className="lh-copy mt3">
            <p  onClick={() => onRouteChange('Register')} className="f6 link dim black db pointer">Register</p>
          </div>
        </div>
    </form>
  );
}

export default Signin;
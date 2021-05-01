import React,{useState} from "react";
import firebase from "firebase"
import {useHistory} from "react-router-dom"

export const Login = (props)  => {
    const [inputs, setInputs] = useState({});
    const history = useHistory()

    const handleInputChange = (event) => {
      event.persist();
      setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log(`User Created!Email: ${inputs.email},password : ${inputs.password}`);
      firebase.auth().signInWithEmailAndPassword(inputs.email.trim(),inputs.password).then(()=>history.push("/home")).catch((e)=>console.log(e));
    }

    return (
      <div className="base-container" ref={props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input type="text" name="email" placeholder="E-mail" value={inputs.email}
              onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="Password" value={inputs.password}
              onChange={handleInputChange} />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    );
  


}



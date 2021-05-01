import React,{useState} from "react";
import firebase from "firebase"

export const Register = (props) => {
  const [inputs, setInputs] = useState({});

    const handleInputChange = (event) => {
      event.persist();
      setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log(`User Created!Email: ${inputs.email},password : ${inputs.password}`);
      firebase.auth().createUserWithEmailAndPassword(inputs.email.trim(),inputs.password).then(()=>{}).catch((e)=>console.log(e));
    }


    return (
      <div className="base-container" ref={props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" placeholder="Username" value={inputs.username}
              onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" placeholder="E-mail" value={inputs.email}
              onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="text" name="password" placeholder="Password" value={inputs.password}
              onChange={handleInputChange}/>
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn" onClick={handleSubmit}>
            Register
          </button>
        </div>
      </div>
    );
  }

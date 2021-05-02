import React from "react"
import axios from "axios"
// import audio from "./Blinding Lights.mp3"
import "./button.css"
export default class Play extends React.Component{

    constructor(props){
      super(props)
      this.state={
        play:true
      }

      this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
      const audioEl = document.getElementsByClassName("audio-element")[0]
      audioEl.play()
      axios.get("http://localhost:5000/muse").then().catch((e)=>console.log(e));
    }
  
    handleClick(){
      const audioEl = document.getElementsByClassName("audio-element")[0]
      if(this.state.play){
        this.setState({
        play:false
        })
        audioEl.pause()
      }else{
        this.setState({play:true})
        audioEl.play()
      }
    }
  
    render() {
      return (
        <div>
          <audio className="audio-element">
            <source src={audio}></source>
          </audio>
          <h1>Playing Blinding Lights</h1>
          <h5>The Weeknd</h5>
          <div class="button" onClick={this.handleClick}>
            <span class="text">{this.state.play ? "Pause" : "Play"}</span>
          </div>
        </div>
      )
    }
   }
  
  
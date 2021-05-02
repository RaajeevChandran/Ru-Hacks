import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components"
import {HomeContainer,PeopleContainer,BotContainer,CodeEditorContainer} from "./homeStyles"
import { useParams } from 'react-router-dom'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import Editor from "@monaco-editor/react";
import { ReactTerminal,TerminalContextProvider } from "react-terminal";
import ChatBot from 'react-simple-chatbot';
import {ThemeProvider} from 'styled-components'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import "./button.css"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Play from "./play"
import WebEditorUtil from "./webEditorUtil"
import { MusicNote } from '@material-ui/icons'
const socket = io.connect('http://localhost:5000')




export default function Stream(props) {
  const [me, setMe] = useState('')
  const [otherUser,setOtherUser] = useState('')
  const [stream, setStream] = useState()
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState("")
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState("")
  const [lang,setLang ]  = useState('html/css/js')

  const [open, setOpen] = React.useState(true);

  const [inputID, setInputID] = useState('')

  let { id } = useParams()
  const myVideo = useRef(null)
  const userVideo = useRef(null)
  const connectionRef = useRef(null)

  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) =>{
    editorRef.current = editor; 
  }

  const theme = {
    headerBgColor: '#36393f',
    fontFamily: 'Arial',
    background: '#2f3136',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#36393f',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };
  
  const config ={
    width: "300px",
    height: "500px",
    floating: true,
  };


  

  const options = [
    'HTML/CSS/JS','JavaScript','Java','Python','CPP'
  ];

  //ComponentDidMount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(inputVideo => {
        setStream(inputVideo)

        let video = myVideo.current
        video.srcObject = inputVideo
        video.play()

      })


    //When a user gets connected
    socket.on('me', (id) => {
      console.log('Id',id)
      setMe(id)
      

    })

    //When receiving a call
    socket.on("callUser", (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)

      //Answer the call
      console.log('Call Received')
      console.log('From', data.from, 'Name', data.name, 'Signal', data.signal)

    })

  }, []);

  //When the input id changes
  const onChangeInputId = (e) => {

    setInputID(e.target.value)
  }

  //Join request
  const callUser = (e) => {
    e.preventDefault()

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: inputID,
        signalData: data,
        from: me,
        name: name
      })
    })
    peer.on("stream", (stream) => {
      let video = userVideo.current
      video.srcObject = stream
      video.play()
      setOtherUser("Will Byers")

    })
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    setOpen(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller })
    })
    peer.on("stream", (stream) => {
      let video = userVideo.current
      video.srcObject = stream
      video.play()
    })

    peer.signal(callerSignal)
    connectionRef.current = peer
  }

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current.destroy()
  }

  const RoomIDTextField = styled.input`
      outline:none;
    width:90%;
    border-radius:5px;
    height:40px;
    border:none;
    text-indent:10px;
    margin:5px;
    `;

    const Transition = React.forwardRef(function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
    });
    
    const AlertDialogSlide = () => {
  
    
      const handleClose = () => {
        setOpen(false);
      };
    
      return (
       
          
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Incoming Call...."}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Do you want to let this user inside the room?.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>setOpen(false)} color="primary">
                Deny
              </Button>
              <Button onClick={answerCall} color="primary">
                Accept
              </Button>
            </DialogActions>
          </Dialog>
          
     
      );
    }
  

  return (
    <HomeContainer>
      <PeopleContainer>
      <h1 style={{textAlign:"left",}}>People</h1>
                <div style={{height:"100%",position:"relative",borderRadius:"20px"}}>
                    <video ref={myVideo} muted style={{width:"250px",objectFit:"cover",borderRadius:"20px",}} />
                    {me!=='' ? <h3 style={{}}>Raajeev Chandran</h3> : <div></div>}
                    <video ref={userVideo} muted style={{width:"250px",objectFit:"cover",borderRadius:"20px",}}/>
                    {otherUser!=='' ? <h3 style={{}}>Will Byers</h3> : <div></div>}

                </div>
         

                <RoomIDTextField placeholder="Enter the User id" onChange={(e)=>setInputID(e.target.value)}/>
          <div class="button" onClick={callUser}>
            <span class="text">Add User</span>
          </div>

          <div>
          {receivingCall && !callAccepted ? (
              <AlertDialogSlide/>
            ) : null}
          </div>

          <p>Your Id: {me}</p>
      </PeopleContainer>
      <CodeEditorContainer>
    
    </HomeContainer>
  )
}




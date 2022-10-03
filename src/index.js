import ReactDOM, { render } from 'react-dom';
import React, { Component } from 'react'
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import {Card, Avatar, Input, Typography} from 'antd';   
import 'antd/dist/antd.css';
import Search from 'antd/lib/input/Search';
import './index.css'


const search =Input;
const { Text } = Typography;
const {Meta} = Card;
const client = new W3CWebSocket('ws://127.0.0.1:8000');

export default class App extends Component {
  
    state ={
        userName: '',
        isLoggedIn: false,
        messages: []
     } 

    onButtonClicked = (value) => {
        client.send(JSON.stringify({
            type: "message",
            msg: value,
            user: this.state.userName,
            typing:"typing"
        }));
        this.setState({ searchVal: ''})

    }

    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log('got reply', dataFromServer);
            if (dataFromServer.type === "message") {
                this.setState((state) => ({
                    messages: [...state.messages,
                    {   
                        msg: dataFromServer.msg,
                        user: dataFromServer.user
                    }]
                }));
            }
        };
    }
  render() {
    return (
      <div className='joinChatContainer'>
        {this.state.isLoggedIn ?
        <div>
         <div className='chat-header'>
            <Text type= "secondary" style= {{fontSize:"30px"}}> Welcome to My Chat app</Text>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} >
         {this.state.messages.map(message => 
           <Card key={message.msg} style={{ width: 300, margin: '16px 4px 0 4px', alignSelf: this.state.userName === message.user ? 'flex-end' : 'flex-start'}}>
            <Meta 
              avatar= {
                <Avatar style={{ color: 'lightblue', backgroundColor: 'darkblue' }}>{message.user[0].toUpperCase() }</Avatar>
              }
              title= {message.user}
              description= {message.msg}
            /> 

           </Card>
            
        )}
        </div>
         <div className='message-container'>
            <Search 
            placeholder='enetr message and send'
            enterButton= " send"
            value={ this.state.searchVal }
            size= "large"
            onChange={(e) => this.setState({ searchVal: e.target.value })}
            onSearch= { value => this.onButtonClicked(value) }
            />

         </div>
        </div>
        :
        <div style={{padding:'100px 40px'}}>
            <Search
            placeholder='Enter Username'
            enterButton = 'Login'
            size='large' 
            onSearch={value => this.setState({ isLoggedIn : true, userName:value })}/>
        </div>
        }
        
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));

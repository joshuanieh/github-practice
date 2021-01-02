import './App.css'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, message, Tag } from 'antd'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { MESSAGES_QUERY } from './graphql/query'
import { CREATE_MESSAGE_MUTATION } from './graphql/mutation'
import { MESSAGES_SUBSCRIPTION } from './graphql/subscription'

function App(props) { 
  const [confirmedName, setConfirmedName] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState({})

  console.log(confirmedName)

  // client.onmessage = (message) => {
  //   const { data } = message
  //   const [task, payload] = JSON.parse(data)
  const { loading, error, subscribeToMore, data } = useQuery(MESSAGES_QUERY, {
      variables: { name: confirmedName },
      skip: confirmedName===""
    })
  console.log(loading, error, data)
  const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION)
  const clearMessages = 'halo'
  function handleConfirmedNameSubmit() {
    setConfirmedName(name)
  }
  console.log(subscribeToMore)
  useEffect(()=>{
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      variables: { collector: confirmedName },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(22)
        if(!subscriptionData.data) return prev
        return {
          message: [...prev.message, subscriptionData.data.message.data]
        }
      }
    })}, [subscribeToMore])
  //   switch (task) {
  //     case 'init': {
  //       setMessages(() => payload)
  //       break
  //     }
  //     case 'output': {
  //       setMessages(() => [...messages, payload])
  //       break
  //     }
  //     case 'status': {
  //       setStatus(payload)
  //       break
  //     }
  //     case 'cleared': {
  //       setMessages([])
  //       break
  //     }
  //     default:
  //       break
  //   }
  // }

  // client.onopen = () => {
  //   setOpened(true)
  // }

  // const sendData = (data) => {
  //   // TODO
  //   client.send(JSON.stringify(data))
  // }

  // const sendMessage = (msg) => {
  //   // TODO
  //   sendData(['input', msg])
  // }

  // const clearMessages = () => {
  //   // TODO
  //   sendData(['clear'])
  // }

  // const { status, opened, messages, sendMessage, clearMessages } = useChat()

  const bodyRef = useRef(null)


  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s
      const content = {
        content: msg,
        duration: 0.5
      }

      switch (type) {
        case 'success':
          message.success(content)
          break
        case 'info':
          message.info(content)
          break
        case 'danger':
        default:
          message.error(content)
          break
      }
    }
  }

  useEffect(() => {
    displayStatus(status)
  }, [status])

  if(confirmedName) return(
      <div className="App">
        <div className="App-title">
          <h1>Simple Chat</h1>
          <Button type="primary" danger onClick={clearMessages}>
            Clear
          </Button>
        </div>
        <div className="App-messages">
          {!data ? (
            <p style={{ color: '#ccc' }}>
              {loading?  'Loading...' : 'No messages...'}
            </p>
          ) : (
            data.message.map(({ emitter, collector, body }, i) => (
              <p className="App-message" key={i}>
                <Tag color="blue">{`${emitter}->${collector}`}</Tag> {body}
              </p>
            ))
          )}
        </div>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              bodyRef.current.focus()
            }
          }}
        ></Input>
        <Input.Search
          rows={4}
          value={body}
          ref={bodyRef}
          enterButton="Send"
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message here..."
          onSearch={(msg) => {
            if (!msg || !username) {
              displayStatus({
                type: 'error',
                msg: 'Please enter a username and a message body.'
              })
              return
            }
  
            sendMessage({
              variables: { emitter: confirmedName, collector: username, body: msg }})
            setBody('')
          }}
        ></Input.Search>
      </div>
  )
  else return(
    <form onSubmit={handleConfirmedNameSubmit}
          style={{
                textAlign: "center",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
    }}>
      <input placeholder="your name"
             type='text'
             value={name}
             onChange={e => {
              e.preventDefault()
              setName(e.target.value)
            }}
      />
      <input type="submit" value="Submit"/>
    </form>
  )
}

export default App

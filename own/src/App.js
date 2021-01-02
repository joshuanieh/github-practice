import './App.css'
import { isEqual } from 'lodash'
import React, { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Button, Input, message, Space, Tag } from 'antd'
import { queries, mutations, subscriptions } from './graphql'

function App() {
  const [username, setUsername] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [hasSetName, setHasSetName] = useState(false)
  const [body, setBody] = useState('')
  const [status, setStatus] = useState({})

  const { messageQuery } = queries
  const { createMessageMutation, deleteMyMessagesMutation } = mutations
  const { messageSubscription } = subscriptions

  const { loading, error, data, subscribeToMore } = useQuery(
    messageQuery,
    { 
      variables: { 
        input: { user: username, receiver: receiverName }
      }
    }
  )
  const [createMessage] = useMutation(createMessageMutation)
  const [deleteMyMessages] = useMutation(deleteMyMessagesMutation)

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    return subscribeToMore({
      document: messageSubscription,
      variables: {
        input: { user: username, receiver: receiverName }
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const mutationType = subscriptionData.data.message.mutation
        const newMessages = subscriptionData.data.message.data
        return mutationType === "CREATED" ? {
          message: [...prev.message, newMessages[0]]
        } : {
          message: prev.message.filter((e) => {
            for(let m of newMessages){
              if(isEqual(e,m)){
                return false
              }
            }
            return true
          })
        }
      }
    })
  }, [subscribeToMore, messageSubscription, username, receiverName])
  
  useEffect(() => {
    if(hasSetName){
      const element = document.querySelector('.App-messages')
      element.scrollTop = element.scrollHeight
    }
  }, [hasSetName, data])

  useEffect(() => {
    displayStatus(status)
  }, [status])

  const sendMessage = useCallback(
    () => {
      if (!body) return
      createMessage({
        variables: {
          input: { user: username, receiver: receiverName, body: body}
        }
      })
      setBody('')
    }, [createMessage, username, receiverName, body]
  )

  const clearMessages = useCallback(
    () => {
      deleteMyMessages({
        variables: {
          input: { user: username, receiver: receiverName}
        }
      })
    }, [deleteMyMessages, username, receiverName]
  )

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

  const enterChat = (e) => {
    if(username && receiverName && e.key === 'Enter'){
      setHasSetName(true)
      setStatus({ type: 'success', msg: "Successfully join."})
    }
  }

  return (
    <div className="App">
      {hasSetName ?
        <>
          <div className="App-title">
            <h1>Simple Chat</h1>
            <Space>
              <Button type="primary" danger onClick={() => {
                clearMessages()
                setStatus({ type: 'info', msg: "Message cache cleared."})
              }}>
              Clear
              </Button>
              <Button type="primary" danger onClick={() => {
                setHasSetName(false)
                setStatus({ type: 'success', msg: "Successfully leave."})
              }}>
              Leave
              </Button>
            </Space>
          </div>
          <div className="App-messages">
            {error ? (
              <p style={{ color: '#ccc' }}>Error :(</p>
            ) : (
              loading ? (
                <p style={{ color: '#ccc' }}>Loading...</p>
              ) : (
                data.message.length === 0 ? (
                  <p style={{ color: '#ccc' }}>No messages...</p>
                ) : (
                  data.message.map(({ _id, user, body }) => (
                    user === username ? (
                      <div key={_id} align="right">
                        <Space>{body} <Tag color="green">{user}</Tag></Space>
                      </div>
                    ) : (
                      <div key={_id} align="left">
                        <Tag color="blue">{user}</Tag> {body}
                      </div>
                    )
                  ))
                )
              )
            )}
          </div>
          <h2>You are <b>{username}</b>. Chatting with <b>{receiverName}</b>.</h2>
          <Input.Search
            rows={4}
            value={body}
            autoFocus
            enterButton="Send"
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type a message here..."
            onSearch={(msg) => {
              if (!msg) {
                setStatus({ type: 'error', msg: "Please enter a message body."})
                return
              }
              setStatus({ type: 'success', msg: "Message sent."})
              sendMessage()
              setBody('')
            }}
          ></Input.Search>
        </>
      :
        <>
          <h1>Who are you?</h1>
          <Input
            type="text"
            autoFocus
            placeholder="Enter your name here..."
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={enterChat}
          >
          </Input>
          <br />
          <h1>Chatting with...</h1>
          <Input
            type="text"
            placeholder="Enter a receiver here..."
            onChange={(e) => setReceiverName(e.target.value)}
            onKeyUp={enterChat}
          >
          </Input>
          <br />
          <Button
            disabled={!username || !receiverName}
            onClick={() => {
              setHasSetName(true)
              setStatus({ type: 'success', msg: "Successfully join."})
            }}
          >
          Enter
          </Button>
        </>
        }
      </div>
  )
}

export default App

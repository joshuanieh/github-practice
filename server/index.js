require('dotenv-defaults').config()

const { GraphQLServer, PubSub } = require('graphql-yoga')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const WebSocket = require('ws')

const Message = require('./models/message')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')

  const pubsub = new PubSub()

  const gql = new GraphQLServer({
    typeDefs: './server/schema.graphql',
    resolvers: {
      Query,
      Mutation,
      Subscription,
    },
    context: {
      Message,
      pubsub
    }
  })
  
  wss.on('connection', ws => {
    const sendData = (data) => {
      ws.send(JSON.stringify(data))
    }

    const sendStatus = (s) => {
      sendData(['status', s])
    }

    Message.find()
      .limit(100)
      .sort({ _id: 1 })
      .exec((err, res) => {
        if (err) throw err

        // initialize app with existing messages
        sendData(['init', res])
      })

    ws.onmessage = (message) => {
      const { data } = message
      console.log(data)
      const [task, payload] = JSON.parse(data)

      switch (task) {
        case 'input': {
          // TODO
          Message.insertMany(payload)
          sendData(['output', payload])
          sendStatus({
            type: 'success',
            msg: 'Message sent.'
          })
          break
        }
        case 'clear': {
          Message.deleteMany({}, () => {
            sendData(['cleared'])

            sendStatus({
              type: 'info',
              msg: 'Message cache cleared.'
            })
          })

          break
        }
        default:
          break
      }
    }
  })

  const PORT = process.env.port || 2000

  gql.start(4000, () => {
    console.log(`Listening on http://localhost:4000`)
  })

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
})

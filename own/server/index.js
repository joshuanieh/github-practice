require('dotenv-defaults').config()

const { GraphQLServer, PubSub } = require('graphql-yoga')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const mongoose = require('mongoose')
const Message = require('./models/message')

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

  const server = new GraphQLServer({
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
  
  const PORT = process.env.PORT || 4000
  
  server.start(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })

})

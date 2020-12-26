const Mutation = {
  async createMessage(parent, { input }, { Message, pubsub }){
    const { name, body } = input
    await Message.insertMany({
      name: name,
      body: body
    })
    const message = (await Message.find()).slice(-1)[0]
    pubsub.publish(`post ${name}`,{
      message: {
        mutation: "CREATED",
        data: message
      }
    })
    return message
  },
  async deleteMessageById(parent, { id }, { Message, pubsub }){
    const [message] = await Message.find({ _id: id })
    console.log(message)
    await Message.deleteMany({ _id: id })
    pubsub.publish(`post ${message.name}`,{
      message: {
        mutation: "DELETED",
        data: message
      }
    })
    return message
  }
}

module.exports = Mutation

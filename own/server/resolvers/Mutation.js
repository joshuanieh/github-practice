const Mutation = {
  async createMessage(_parent, { input }, { Message, pubsub }){
    const { user, receiver, body } = input
    const [bigName, smallName] = user>receiver ? [user, receiver] : [receiver, user]
    await Message.insertMany({
      user: user,
      receiver: receiver,
      body: body
    })
    const message = (await Message.find()).slice(-1)
    pubsub.publish(`post ${bigName} ${smallName}`,{
      message: {
        mutation: "CREATED",
        data: message
      }
    })
    return message
  },
  async deleteMyMessages(_parent, { input }, { Message, pubsub }){
    const { user, receiver } = input
    const [bigName, smallName] = user>receiver ? [user, receiver] : [receiver, user]
    const message = await Message.find({ user: user, receiver: receiver })
    await Message.deleteMany({ user: user, receiver: receiver })
    pubsub.publish(`post ${bigName} ${smallName}`,{
      message: {
        mutation: "DELETED",
        data: message
      }
    })
    return message
  }
}

module.exports = Mutation

const Query = {
  async message(parent, { input }, { Message }){
    const { user, receiver } = input
    const messages = await Message.find({ $or:
      [
        { user: user, receiver: receiver },
        { user: receiver, receiver: user }
      ]
    })
    return messages
  }
}

module.exports = Query

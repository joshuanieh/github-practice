const Query = {
  async message(parent, args, { Message }){
    const messages = await Message.find()
    return messages
  }
}

module.exports = Query

const Subscription = {
    message: {
        subscribe(parent, { name }, { Message, pubsub }){
            return pubsub.asyncIterator(`post ${name}`)
        }
    }
}

module.exports = Subscription
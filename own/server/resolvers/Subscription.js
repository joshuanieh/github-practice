const Subscription = {
    message: {
        subscribe(_parent, { input }, { pubsub }){
            const { user, receiver } = input
            const [bigName, smallName] = user>receiver ? [user, receiver] : [receiver, user]
            return pubsub.asyncIterator(`post ${bigName} ${smallName}`)
        }
    }
}

module.exports = Subscription
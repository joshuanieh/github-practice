const Subscription = {
	message: {
		subscribe(parent, { collector }, { pubsub, Message }) {
			return pubsub.asyncIterator(collector)
		}}
}
module.exports = Subscription
const Subscription = {
	message: {
		subscribe(parent, { collector }, { pubsub }) {
			return pubsub.asyncIterator(collector)
		}}
}
module.exports = Subscription
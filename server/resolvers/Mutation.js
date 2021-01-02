const Mutation = {
	createMessage(parent, { input: { emitter, collector, body } }, { pubsub, Message }) {
	    Message.insertMany({ emitter, collector, body })
		pubsub.publish(collector, {
			message: {
				mutation: "CREATED",
				data: { emitter, collector, body }
			}
		})
		return { emitter, collector, body }
	},
	async updateMessage(parent, { input: { emitter, collector, body, newBody } }, { pubsub, Message }) {
		if (await Message.countDocuments({ emitter, collector, body })) {
			await Message.updateOne({ emitter, collector, body }, { $set: { body: newBody }})
			body = newBody
			pubsub.publish(collector, {
				message: {
					mutation: "UPDATED",
					data: { emitter, collector, body }
				}
			})
			return { emitter, collector, body }
		}
	},
	async deleteMessage(parent, { collector }, { pubsub, Message }) {
		await Message.deleteMany()
		pubsub.publish(collector, {
			message: {
				mutation: "DELETED",
				data: null
			}
		})
		return null
	}
}

module.exports = Mutation
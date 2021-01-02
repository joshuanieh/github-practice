const Query = {
	async message(parent, { name }, { Message }) {
		const db = await Message.find({})	
		return db.filter(message => {
			return message.emitter === name | message.collector === name
		})
	},
	async messages(parent, args, { Message }) {
		return await Message.find({})
	}
}

module.exports = Query
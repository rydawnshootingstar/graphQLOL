const Comment = {
	author(parent, args, { db }, info) {
		return db.users.find((user) => {
			return user.id === parent.author;
		});
	},
	post(parent, args, { db }, info) {
		return db.proasts.find((proast) => {
			return proast.id === parent.post;
		});
	},
};

export default Comment;

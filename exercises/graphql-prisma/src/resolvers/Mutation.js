import { v4 as uuid } from 'uuid';

const Mutation = {
	createUser(parent, args, { db }, info) {
		const emailTaken = db.users.some((user) => {
			return user.email === args.data.email;
		});

		if (emailTaken) {
			throw new Error(`A user with this email already exists. Please choose a unique email.`);
		}

		const user = {
			id: uuid(),
			...args.data,
		};

		db.users.push(user);
		return user;
	},
	updateUser(parent, { id, data }, { db }, info) {
		const user = db.users.find((user) => {
			return user.id === id;
		});

		if (!user) {
			throw new Error(`This id does not belong to a user`);
		}

		if (typeof data.email === 'string') {
			const emailTaken = db.users.some((user) => {
				return user.email === data.email;
			});

			if (emailTaken && data.email !== user.email) {
				throw new Error(`A user with this email already exists. Please choose a unique email`);
			}

			user.email = data.email;
		}
		if (typeof data.name === 'string') {
			user.name = data.name;
		}

		if (typeof data.age !== 'undefined') {
			user.age = data.age;
		}
		return user;
	},
	deleteUser(parent, args, { db }, info) {
		const userIndex = db.users.findIndex((user) => {
			return user.id === args.id;
		});

		if (userIndex === -1) {
			throw new Error(`This id does not belong to a user`);
		}

		// remember, splice returns values that were removed, and we want them in this case
		// this will delete the user
		const deletedUsers = db.users.splice(userIndex, 1);

		// delete all of a user's posts, and each of those post's comments
		db.proasts = db.proasts.filter((proast) => {
			const postsToDelete = proast.author === args.id;

			if (postsToDelete) {
				db.comments = db.comments.filter((comment) => {
					return comment.post !== proast.id;
				});
			}

			return !postsToDelete;
		});

		// delete all of a user's comments
		db.comments = db.comments.filter((comment) => {
			return comment.author !== args.id;
		});

		return deletedUsers[0];
	},
	createPost(parent, args, { db, pubsub }, info) {
		const userExists = db.users.some((user) => {
			return user.id === args.data.author;
		});

		if (!userExists) {
			throw new Error(`This id does not belong to a user.`);
		}

		const post = {
			id: uuid(),
			...args.data,
		};

		db.proasts.push(post);
		if (post.published) {
			pubsub.publish(`post`, {
				post: {
					data: post,
					mutation: 'CREATED',
				},
			});
		}
		return post;
	},
	updatePost(parent, { id, data }, { db, pubsub }, info) {
		const post = db.proasts.find((proast) => {
			return proast.id === id;
		});

		const originalPost = { ...post };

		if (!post) {
			throw new Error(`A post with this ID does not exist`);
		}

		if (typeof data.title === 'string') {
			post.title = data.title;
		}

		if (typeof data.body === 'string') {
			post.body = data.body;
		}

		if (typeof data.published === 'boolean') {
			post.published = data.published;
			if (originalPost.published && !post.published) {
				pubsub.publish(`post`, {
					post: {
						mutation: 'DELETED',
						data: originalPost,
					},
				});
			} else if (!originalPost.published && post.published) {
				pubsub.publish(`post`, {
					post: {
						mutation: 'CREATED',
						data: post,
					},
				});
			} else if (post.published) {
				pubsub.publish(`post`, {
					post: {
						mutation: 'UPDATED',
						data: post,
					},
				});
			}
		}

		return post;
	},
	deletePost(parent, args, { db, pubsub }, info) {
		const postToDeleteIndex = db.proasts.findIndex((post) => {
			return post.id === args.id;
		});

		if (postToDeleteIndex === -1) {
			throw new Error(`No post with this id exists`);
		}

		// deletes posts and store returned value in array
		const deletedProasts = db.proasts.splice(postToDelete, 1);

		// delete all comments associated with post
		db.comments.filter((comment) => {
			return comment.post !== args.id;
		});

		if (deletedProasts[0].published) {
			pubsub.publish(`post`, {
				post: {
					mutation: 'DELETED',
					data: deletedProasts[0],
				},
			});
		}

		return deletedProasts[0];
	},
	createComment(parent, { data }, { db, pubsub }, info) {
		const userExists = db.users.some((user) => {
			return user.id === data.author;
		});

		const postExists = db.proasts.filter((proast) => {
			return proast.id === data.post && proast.published;
		});

		if (!userExists) {
			throw new Error(`This ID does not belong to a user.`);
		}
		if (!postExists) {
			throw new Error(`A published post with this ID doesn't exist`);
		}

		const comment = {
			id: uuid(),
			...data,
		};
		db.comments.push(comment);
		pubsub.publish(`comment: ${data.post}`, {
			comment: {
				mutation: 'CREATED',
				data: comment,
			},
		});

		return comment;
	},
	updateComment(parent, { id, data }, { db, pubsub }, info) {
		const comment = db.comments.find((comment) => {
			return comment.id === id;
		});

		if (!comment) {
			throw new Error(`A comment with this ID doesn't exist`);
		}

		if (typeof data.text === 'string') {
			comment.text = data.text;
		}
		pubsub.publish(`comment: ${comment.post}`, {
			comment: {
				mutation: 'UPDATED',
				data: comment,
			},
		});
		return comment;
	},
	deleteComment(parent, { id }, { db, pubsub }, info) {
		const commentIndex = db.comments.findIndex((comment) => {
			return comment.id === id;
		});

		if (commentIndex === -1) {
			throw new Error(`No comment with this id exists`);
		}

		const deletedComments = db.comments.splice(commentIndex, 1);

		pubsub.publish(`comment: ${deletedComments[0].post}`, {
			comment: {
				mutation: 'DELETED',
				data: deletedComments[0],
			},
		});

		return deletedComments[0];
	},
};

export default Mutation;

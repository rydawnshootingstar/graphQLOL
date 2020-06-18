const Query = {
	/* 
		- when you query through node you can use a string, nothing, or an object as a parameter to your prisma query. we'll use an object
		- return the promise provided by prisma.query for each query call 
		TODO: connect to db and use raw queries for future searches on frontend, as prisma's _contains is case sensitive only 
			sources: https://www.youtube.com/watch?time_continue=12&v=YUjlBuI8xsU
	*/
	users(parent, args, { prisma }, info) {
		const opArgs = {};
		if (args.query) {
			opArgs.where = {
				OR: [
					{
						name_contains: args.query,
					},
					{
						email_contains: args.query,
					},
				],
			};
		}

		return prisma.query.users(opArgs, info);
	},
	artists(parent, args, { prisma }, info) {
		const opArgs = {};
		if (args.query) {
			opArgs.where = {
				name_contains: args.query,
			};
		}
		return prisma.query.artists(opArgs, info);
	},
	reviews(parent, args, { prisma }, info) {
		const opArgs = {};
		if (args.query) {
			opArgs.where = {
				album: {
					title_contains: args.query,
				},
			};
		}
		return prisma.query.reviews(opArgs, info);
	},
	albums(parent, args, { prisma }, info) {
		const opArgs = {};
		if (args.query) {
			opArgs.where = {
				title_contains: args.query,
			};
		}
		return prisma.query.albums(opArgs, info);
	},
	comments(parent, args, { prisma }, info) {
		return prisma.query.comments(null, info);
	},
};
export default Query;

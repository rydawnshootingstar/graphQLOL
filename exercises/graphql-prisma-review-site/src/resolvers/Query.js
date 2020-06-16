const Query = {
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
		// when you query through node you can use a string, nothing, or an object.
		// we return the promise for this resolve
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
	// reviews(parent, args, { prisma }, info) {
	// 	return prisma.query.reviews(null, info);
	// },
	// albums(parent, args, { prisma }, info) {
	// 	return prisma.query.albums(null, info);
	// },
};
export default Query;

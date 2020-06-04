const Query = {
	users(parent, args, { prisma }, info) {
		// when you query through node you can use a string, nothing, or an object.
		// we return the promise for this resolver
		return prisma.query.users(null, info);
	},
	artists(parent, args, { prisma }, info) {
		return prisma.query.artists(null, info);
	},
	reviews(parent, args, { prisma }, info) {
		return prisma.query.reviews(null, info);
	},
	albums(parent, args, { prisma }, info) {
		return prisma.query.albums(null, info);
	},
};
export default Query;

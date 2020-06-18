import { GraphQLServer, PubSub } from 'graphql-yoga';
import Query from './resolvers/Query';
import User from './resolvers/User';
import Album from './resolvers/Album';
import Artist from './resolvers/Artist';
import Comment from './resolvers/Comment';
import Mutation from './resolvers/Mutation';
import Review from './resolvers/Review';
import prisma from './prisma';
/*
    Server Config and Initialization
*/

const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: 'src/schema.graphql',
	resolvers: {
		Query,
		User,
		Album,
		Artist,
		Comment,
		Mutation,
		Review,
	},
	context: {
		pubsub,
		prisma,
	},
});

server.start(() => {
	console.log(`--- server has started on port 4000 ---`);
});

import { GraphQLServer, PubSub } from 'graphql-yoga';
import Query from './resolvers/Query';
import User from './resolvers/User';
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
	},
	context: {
		pubsub,
		prisma,
	},
});

server.start(() => {
	console.log(`--- server has started on port 4000 ---`);
});

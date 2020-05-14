import { GraphQLServer } from 'graphql-yoga';

// Type defs

const users = [
	{
		id: 123,
		name: 'Ryan',
		email: 'ryan@ryan.com',
		age: 31
	},
	{
		id: 124,
		name: 'Alex',
		email: 'Alex@alex.com',
		age: 26
	},
	{
		id: 125,
		name: 'Mitch',
		email: 'mitch@mitchell.com',
		age: 25
	}
];

const typeDefs = `

    type Query{
        me: User!
        post: Post!
        users(query: String):  [User!]!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers

const resolvers = {
	Query: {
		me(parent, args, ctx, info) {},
		post(parent, args, ctx, info) {},
		users(parent, args, ctx, info) {
			if (!args.query) {
				return users;
			}
			return users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase());
			});
		}
	}
};

const server = new GraphQLServer({
	typeDefs,
	resolvers
});

server.start(() => {
	console.log(`--- server has started on port 4000 ---`);
});

import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuid } from 'uuid';

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

const proasts = [
	{
		id: 1,
		title: 'poasting in a thread',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: true,
		author: 123
	},
	{
		id: 2,
		title: 'poasting in a dead',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: false,
		author: 123
	},
	{
		id: 3,
		title: 'poasting in a bread',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: true,
		author: 124
	},
	{
		id: 4,
		title: 'poasting in a dread',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: true,
		author: 125
	}
];

const comments = [
	{
		id: 1,
		text: 'comment one',
		author: 123,
		post: 1
	},
	{
		id: 2,
		text: `comment two`,
		author: 123,
		post: 1
	},
	{
		id: 3,
		text: `comment 3`,
		author: 124,
		post: 4
	}
];

const typeDefs = `

    type Query{
        me: User!
        post: Post!
        posts (query: String): [Post!]!
        users(query: String):  [User!]!
        comments(query: String, user: String): [Comment!]!
    }

    type Mutation{
        createUser(name: String!, email: String!, age: Int): User!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment{
        id: ID!
        text: String!
        author: User!
        post: Post!
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
		},
		posts(parent, args, ctx, info) {
			if (!args.query || args.query === '') {
				return proasts;
			}

			return proasts.filter((proast) => {
				return (
					proast.published &&
					(proast.title.toLowerCase().includes(args.query) || proast.body.toLowerCase().includes(args.query))
				);
			});
		},
		comments(parent, args, ctx, info) {
			if (!args.query) {
				return comments;
			}

			return comments.filter((comment) => {
				return comment.text.toLowerCase().includes(args.query.toLowerCase());
			});
		}
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = users.some((user) => {
				return user.email === args.email;
			});

			if (emailTaken) {
				throw new Error(`A user with this email already exists. Please choose a unique email.`);
			}

			const user = {
				id: uuid(),
				name: args.name,
				email: args.email,
				age: args.age || null
			};

			users.push(user);
			return user;
		}
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.post === parent.id;
			});
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return proasts.filter((proast) => {
				return proast.author === parent.id;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.author === parent.id;
			});
		}
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		post(parent, args, ctx, info) {
			return proasts.find((proasts) => {
				return proasts.id === parent.id;
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

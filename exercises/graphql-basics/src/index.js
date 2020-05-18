import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuid } from 'uuid';

// Type defs

const users = [
	{
		id: "ed95984f-3c84-4f36-8b47-792308ff936c",
		name: 'Ryan',
		email: 'ryan@ryan.com',
		age: 31
	},
	{
		id: '9af1657b-7c88-44ca-96d5-a447b18bbec9',
		name: 'Alex',
		email: 'Alex@alex.com',
		age: 26
	},
	{
		id: '03fd8f3d-d657-4c37-a6f0-2bbf8ea81868',
		name: 'Mitch',
		email: 'mitch@mitchell.com',
		age: 25
	}
];

const proasts = [
	{
		id: 'b3cfd642-5fbb-4ba1-972b-e88e349e09c5',
		title: 'poasting in a thread',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: true,
		author: "ed95984f-3c84-4f36-8b47-792308ff936c"
	},
	{
		id: 'a9a9ea1f-ca6a-4e72-885f-169b2424d0dc',
		title: 'poasting in a dead',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: false,
		author: "ed95984f-3c84-4f36-8b47-792308ff936c"
	},
	{
		id: '5c9302ea-2c9a-488a-889b-70457897df7e',
		title: 'poasting in a bread',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: true,
		author: '9af1657b-7c88-44ca-96d5-a447b18bbec9'
	},
	{
		id: '7be9f291-ba6b-4308-a6ce-b4a7db38b24a',
		title: 'poasting in a dread',
		body:
			'Laborum do et magna ad minim nisi exercitation id elit ea in commodo tempor eiusmod. Dolor ut amet dolore fugiat in eu. Tempor ut dolore ex consequat enim. Non cillum deserunt esse minim aute.',
		published: true,
		author: '03fd8f3d-d657-4c37-a6f0-2bbf8ea81868'
	}
];

const comments = [
	{
		id: '9f5270a7-d1c2-4fd4-8044-b8ab7462c329',
		text: 'comment one',
		author: "ed95984f-3c84-4f36-8b47-792308ff936c",
		post: 'b3cfd642-5fbb-4ba1-972b-e88e349e09c5'
	},
	{
		id: 'b8e71552-34b2-463e-b1ca-5e4e23d756e1',
		text: `comment two`,
		author: "ed95984f-3c84-4f36-8b47-792308ff936c",
		post: 'b3cfd642-5fbb-4ba1-972b-e88e349e09c5'
	},
	{
		id: '209da04c-6c25-44e3-a9f7-b98b379a0f5f',
		text: `comment 3`,
		author: '9af1657b-7c88-44ca-96d5-a447b18bbec9',
		post: '7be9f291-ba6b-4308-a6ce-b4a7db38b24a'
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
		createPost(title:String!, body: String!, published: Boolean!, author: ID! ) : Post!
		createComment(text: String!, author: ID!, post: ID!): Comment!
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
		},
		createPost(parent, args, ctx, info){
			const userExists = users.some((user)=> {
				return user.id === args.author;
			});

			if(!userExists){
				throw new Error(`This id does not belong to a user.`);
			}

			const post = {
				id: uuid(),
				author: args.author,
				title: args.title,
				body: args.body,
				published: args.published
			}


			proasts.push(post);
			return post;	
		},
		createComment(parent, args, ctx, info){
 			const userExists = users.some((user)=> {
				return user.id === args.author;
			});

			const postExists = proasts.filter((proast)=> {
				return proast.id === args.post && proast.published;
			})

			if(!userExists){
				throw new Error(`This ID does not belong to a user.`);
			}
			if(!postExists){
				throw new Error(`A published post with this ID doesn't exist`)
			}

			const comment = {
				id: uuid(),
				author: args.author,
				text: args.text,
				post: args.post
			}

			comments.push(comment);

			return comment;


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

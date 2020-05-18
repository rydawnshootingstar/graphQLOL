import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuid } from 'uuid';
import {users, proasts, comments} from './dummydata/data';

// Type defs

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

import { GraphQLServer } from "graphql-yoga";
import { v4 as uuid } from "uuid";
import { usersData, proastsData, commentsData } from "./dummydata/data";


let users = usersData;
let proasts = proastsData;
let comments = commentsData;

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
		createUser(data: CreateUserInput): User!
		createPost(data: CreatePostInput) : Post!
		createComment(data: CreateCommentInput): Comment!
		deleteUser(id: ID!): User!
	}
	
	input CreateUserInput{
		name: String!
		email: String
		age: Int
	}

	input CreatePostInput{
		title: String!
		body: String!
		published: Boolean!
		author: ID! 
	}

	input CreateCommentInput{
		text: String!
		author: ID!
		post: ID!
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
                return user.name
                    .toLowerCase()
                    .includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, ctx, info) {
            if (!args.query || args.query === "") {
                return proasts;
            }

            return proasts.filter((proast) => {
                return (
                    proast.published &&
                    (proast.title.toLowerCase().includes(args.query) ||
                        proast.body.toLowerCase().includes(args.query))
                );
            });
        },
        comments(parent, args, ctx, info) {
            if (!args.query) {
                return comments;
            }

            return comments.filter((comment) => {
                return comment.text
                    .toLowerCase()
                    .includes(args.query.toLowerCase());
            });
        },
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => {
                return user.email === args.data.email;
            });

            if (emailTaken) {
                throw new Error(
                    `A user with this email already exists. Please choose a unique email.`
                );
            }

            const user = {
                id: uuid(),
                ...args.data,
            };

            users.push(user);
            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => {
                return user.id === args.id;
            });

            if (userIndex === -1) {
                throw new Error(`This id does not belong to a user`);
            }

            // remember, splice returns values that were removed, and we want them in this case
            // this will delete the user
            const deletedUsers = users.splice(userIndex, 1);

            // delete all of a user's posts, and each of those post's comments
            proasts = proasts.filter((proast) => {
                const postsToDelete = proast.author === args.id;

                if (postsToDelete) {
                    comments = comments.filter((comment) => {
                        return comment.post !== proast.id;
                    });
                }

                return !postsToDelete;
            });

            // delete all of a user's comments
            comments = comments.filter((comment) => {
                return comment.author !== args.id;
            });

            return deletedUsers[0];
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author;
            });

            if (!userExists) {
                throw new Error(`This id does not belong to a user.`);
            }

            const post = {
                id: uuid(),
                ...args.data,
            };

            proasts.push(post);
            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => {
                return user.id === args.data.author;
            });

            const postExists = proasts.filter((proast) => {
                return proast.id === args.data.post && proast.published;
            });

            if (!userExists) {
                throw new Error(`This ID does not belong to a user.`);
            }
            if (!postExists) {
                throw new Error(`A published post with this ID doesn't exist`);
            }

            const comment = {
                id: uuid(),
                ...args.data,
            };

            comments.push(comment);

            return comment;
        },
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
        },
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
        },
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
        },
    },
};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => {
    console.log(`--- server has started on port 4000 ---`);
});

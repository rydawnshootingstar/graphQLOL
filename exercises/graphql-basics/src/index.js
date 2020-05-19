import { GraphQLServer } from "graphql-yoga";
import { v4 as uuid } from "uuid";
import { usersData, proastsData, commentsData } from "./dummydata/data";

// imported data comes in as const!
let users = usersData;
let proasts = proastsData;
let comments = commentsData;



// Resolvers

const resolvers = {
    /*
        Regular Queries
    */
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
    /* 
        Mutations
    */
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
        deletePost(parent, args, ctx, info){
            const postToDelete = proasts.findIndex((post)=> {
                return post.id === args.id;
            });

            if(postToDelete === -1){
                throw new Error(`No post with this id exists`);
            }

            // deletes posts and store returned value in array
           const deletedProasts = proasts.splice(postToDelete, 1);

           // delete all comments associated with post
           comments.filter((comment)=> {
               return comment.post !== args.id
           });

           return deletedProasts[0];
        
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
        deleteComment(parent, args, ctx, info){
            const commentExists = comments.findIndex((comment)=> {
                return comment.id === args.id;
            });

            if(commentExists === -1){
                throw new Error(`No comment with this id exists`);
            }

            const deletedComments = comments.splice(commentExists, 1);

            return deletedComments[0];
        },
    },

    /*
        Type Relationships
    */
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
    typeDefs: 'src/schema.graphql',
    resolvers,
});

server.start(() => {
    console.log(`--- server has started on port 4000 ---`);
});

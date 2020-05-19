import { v4 as uuid } from "uuid";
const Mutation = {
        createUser(parent, args, {db}, info) {
            const emailTaken = db.users.some((user) => {
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

            db.users.push(user);
            return user;
        },
        deleteUser(parent, args, {db}, info) {
            const userIndex = db.users.findIndex((user) => {
                return user.id === args.id;
            });

            if (userIndex === -1) {
                throw new Error(`This id does not belong to a user`);
            }

            // remember, splice returns values that were removed, and we want them in this case
            // this will delete the user
            const deletedUsers = db.users.splice(userIndex, 1);

            // delete all of a user's posts, and each of those post's comments
            db.proasts = db.proasts.filter((proast) => {
                const postsToDelete = proast.author === args.id;

                if (postsToDelete) {
                    db.comments = db.comments.filter((comment) => {
                        return comment.post !== proast.id;
                    });
                }

                return !postsToDelete;
            });

            // delete all of a user's comments
            db.comments = db.comments.filter((comment) => {
                return comment.author !== args.id;
            });

            return deletedUsers[0];
        },
        createPost(parent, args, {db}, info) {
            const userExists = db.users.some((user) => {
                return user.id === args.data.author;
            });

            if (!userExists) {
                throw new Error(`This id does not belong to a user.`);
            }

            const post = {
                id: uuid(),
                ...args.data,
            };

            db.proasts.push(post);
            return post;
        },
        deletePost(parent, args, {db}, info){
            const postToDelete = db.proasts.findIndex((post)=> {
                return post.id === args.id;
            });

            if(postToDelete === -1){
                throw new Error(`No post with this id exists`);
            }

            // deletes posts and store returned value in array
           const deletedProasts = db.proasts.splice(postToDelete, 1);

           // delete all comments associated with post
           db.comments.filter((comment)=> {
               return comment.post !== args.id
           });

           return deletedProasts[0];
        
        },
        createComment(parent, args, {db}, info) {
            const userExists = db.users.some((user) => {
                return user.id === args.data.author;
            });

            const postExists = db.proasts.filter((proast) => {
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

            db.comments.push(comment);

            return comment;
        },
        deleteComment(parent, args, {db}, info){
            const commentExists = db.comments.findIndex((comment)=> {
                return comment.id === args.id;
            });

            if(commentExists === -1){
                throw new Error(`No comment with this id exists`);
            }

            const deletedComments = db.comments.splice(commentExists, 1);

            return deletedComments[0];
        },
    }

    export default Mutation;
const User = {
    posts(parent, args, { db }, info) {
        return db.proasts.filter((proast) => {
            return proast.author === parent.id;
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => {
            return comment.author === parent.id;
        });
    },
};

export default User;

const Query = {
    me(parent, args, { db }, info) {},
    post(parent, args, { db }, info) {},
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }
        return db.db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    posts(parent, args, { db }, info) {
        if (!args.query || args.query === "") {
            return db.proasts;
        }

        return db.db.proasts.filter((proast) => {
            return (
                proast.published &&
                (proast.title.toLowerCase().includes(args.query) ||
                    proast.body.toLowerCase().includes(args.query))
            );
        });
    },
    comments(parent, args, { db }, info) {
        if (!args.query) {
            return db.comments;
        }

        return db.db.comments.filter((comment) => {
            return comment.text
                .toLowerCase()
                .includes(args.query.toLowerCase());
        });
    },
};
export default Query;

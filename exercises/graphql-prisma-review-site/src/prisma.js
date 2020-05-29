import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
	typeDefs: `src/generated/prisma.graphql`,
	endpoint: `http://localhost:4466`,
});

// createPost({
// 	title: 'recipes',
// 	body: "I'm so hungry. Feed me mitch.",
// 	published: true,
// 	author: 'ckaofh7xm00es07694fpg3r5i',
// });

async function changePost({ id, changes }) {
	const post = await prisma.mutation.updatePost(
		{
			where: { id },
			data: {
				...changes,
			},
		},
		`{id body title body published}`
	);

	console.log(JSON.stringify(post, undefined, 2));
}

async function createPostForUser({ id, postData }) {
	const userExists = await prisma.exists.User({
		id,
	});

	if (!userExists) {
		throw new Error(`No user with this ID exists`);
	}

	const post = await prisma.mutation.createPost(
		{
			data: {
				...postData,
				author: {
					connect: {
						id,
					},
				},
			},
		},
		`{ id title published body author{id name email}}`
	);

	return post;
}

async function updatePostForUser({ id, changes }) {
	const postExists = await prisma.exists.Post({
		id,
	});

	if (!postExists) {
		throw new Error(`no Post with this id exists`);
	}
	const post = await prisma.mutation.updatePost(
		{
			where: {
				id,
			},
			data: {
				...changes,
			},
		},
		`{id title body published author{id name email}}`
	);

	return post;
}

// createPostForUser({
// 	id: 'ckaoe9rsp001i0769s1t8c4ol',
// 	postData: { title: 'posting in a bread', body: 'this is the bread', published: true },
// }).catch((err) => console.error(err.message));

// changePost({
// 	id: 'ckaof7szh00c30769788bn2ya',
// 	changes: { published: true, body: 'new body' },
// }).catch((err) => console.error(err.message));

// updatePostForUser({ id: 'ckaqz4z9s00bk0798tkray0jc', changes: { published: false } })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2));
// 	})
// 	.catch((err) => console.error(err.message));

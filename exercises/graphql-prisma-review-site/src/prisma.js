import { Prisma } from 'prisma-binding';
import crypto from 'crypto';

const prisma = new Prisma({
	typeDefs: `src/generated/prisma.graphql`,
	endpoint: `http://localhost:4466/reviews`,
});

export default prisma;

/* 
	User Functions
*/

// async function createUser({ userData }) {
// 	userData.password = crypto.createHmac('sha256', userData.password);
// 	console.log('user password hashed as ', userData.password);
// 	const user = await prisma.mutation.createUser(
// 		{
// 			data: { ...userData },
// 		},
// 		`{id name email active}`
// 	);

// 	return user;
// }

// createUser({ userData: { name: 'Tester', email: 'tester@tester.com', password: '1234', active: true } }).catch((err) =>
// 	console.error(err)
// );

// async function deleteUser({ id }) {
// 	const userExists = await prisma.exists.User({
// 		id,
// 	});
// 	if (!userExistsx) {
// 		throw new Error(`no user with this id exists`);
// 	}

// 	const user = await prisma.mutation.deleteUser(
// 		{
// 			where: { id },
// 		},
// 		`{id name email active}`
// 	);

// 	return user;
// }

// async function updateUser({ id, changes }) {
// 	const userExists = await prisma.exists.User({
// 		id,
// 	});
// 	if (!userExistsx) {
// 		throw new Error(`no user with this id exists`);
// 	}
// 	const user = await prisma.mutation.updateUser(
// 		{
// 			where: { id },
// 			data: { ...changes },
// 		},
// 		`{id name email active}`
// 	);

// 	return user;
// }

// async function createPostForUser({ id, postData }) {
// 	const userExists = await prisma.exists.User({
// 		id,
// 	});

// 	if (!userExists) {
// 		throw new Error(`No user with this ID exists`);
// 	}

// 	const post = await prisma.mutation.createPost(
// 		{
// 			data: {
// 				...postData,
// 				author: {
// 					connect: {
// 						id,
// 					},
// 				},
// 			},
// 		},
// 		`{ id title published body author{id name email}}`
// 	);

// 	return post;
// }

// async function updatePostForUser({ id, changes }) {
// 	const postExists = await prisma.exists.Post({
// 		id,
// 	});

// 	if (!postExists) {
// 		throw new Error(`no Post with this id exists`);
// 	}
// 	const post = await prisma.mutation.updatePost(
// 		{
// 			where: {
// 				id,
// 			},
// 			data: {
// 				...changes,
// 			},
// 		},
// 		`{id title body published author{id name email}}`
// 	);

// 	return post;
// }

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

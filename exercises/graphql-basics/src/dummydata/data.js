export const users = [
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

export const proasts = [
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

export const comments = [
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
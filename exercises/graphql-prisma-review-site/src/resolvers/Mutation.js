import { v4 as uuid } from 'uuid';

/* 
    - We defer error handling responsibilities to Prisma. Error messages will be less human readable without first checking if everything exists
      before attempting to edit, but they'll be good enough.

    - Our input types are scalars, so be sure to send them off to prisma as a connection using the unique value (id). 

*/

const Mutation = {
	async createUser(parent, { data }, { prisma }, info) {
		return prisma.mutation.createUser({ data }, info);
	},
	async updateUser(parent, { id, data }, { prisma }, info) {
		return prisma.mutation.updateUser({ where: { id }, data }, info);
	},
	async deleteUser(parent, { id }, { prisma }, info) {
		return prisma.mutation.deleteUser({ where: { id } }, info);
	},
	async createArtist(parent, { data }, { prisma }, info) {
		return prisma.mutation.createArtist({ data }, info);
	},
	async updateArtist(parent, { id, data }, { prisma }, info) {
		return prisma.mutation.updateArtist({ where: { id }, data }, info);
	},
	async deleteArtist(parent, { id }, { prisma }, info) {
		return prisma.mutation.deleteArtist({ where: { id } }, info);
	},
	async createAlbum(parent, { data }, { prisma }, info) {
		data.artist = { connect: { id: data.artist } };
		return prisma.mutation.createAlbum({ data }, info);
	},
	async updateAlbum(parent, { id, data }, { prisma }, info) {
		if (data.artist) {
			data.artist = { connect: { id: data.artist } };
		}
		return prisma.mutation.updateAlbum({ where: { id }, data }, info);
	},
	async deleteAlbum(parent, { id }, { prisma }, info) {
		return prisma.mutation.deleteAlbum({ where: { id } }, info);
	},
};

export default Mutation;

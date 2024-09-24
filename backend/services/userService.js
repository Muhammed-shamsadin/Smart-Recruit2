const prisma = require('../prisma/client');

// Example seed script to create a user
const createUser = async () => {
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      password: "hashed_password",
    }
  });
};


const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id: Number(id) } });
};

const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id: Number(id) } });
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };

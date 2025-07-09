import { prisma } from '../prisma/client';

class UserService {
  async getUsers() {
    return await prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  }
  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      omit: { password: true },
    });
  }
  async updateUserById(id: string, updateData: object) {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }
  async deleteUserById(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserService();

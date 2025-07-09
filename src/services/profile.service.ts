import { prisma } from '../prisma/client';

class ProfileService {
  async updateProfile(
    userId: string,
    fullName: string,
    bio: string,
    avatar: string,
  ) {
    return prisma.profile.upsert({
      where: { userId },
      update: { fullName, bio, avatar },
      create: { userId, fullName, bio, avatar },
    });
  }
  async deleteProfile(userId: string) {
    return prisma.profile.delete({ where: { userId } });
  }
  async getProfileByUserId(id: string) {
    return prisma.profile.findUnique({
      where: { userId: id },
    });
  }
}

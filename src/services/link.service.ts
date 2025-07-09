import { prisma } from '../prisma/client';
import { createLinkDTO } from '../types/link.dto';

class LinkService {
  async createLink(userId: string, data: createLinkDTO) {
    const { title, url, order, visible } = data;

    return await prisma.link.create({
      data: {
        title,
        url,
        order: order ?? 0,
        visible: visible ?? true,
        userId,
      },
    });
  }
  async getLinks(userId: string) {
    return await prisma.link.findMany({
      where: { userId },
    });
  }
  async getLinkById(id: string) {
    return await prisma.link.findUnique({ where: { id } });
  }
  async deleteLink(id: string) {
    return await prisma.link.delete({ where: { id } });
  }
  async updateLink(id: string, data: object) {
    return await prisma.link.update({ where: { id }, data: data });
  }
}

export default new LinkService();

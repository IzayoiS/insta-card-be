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
  async getLinks() {
    return await prisma.link.findMany();
  }
}

export default new LinkService();

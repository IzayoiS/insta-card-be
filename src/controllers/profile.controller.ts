import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';

class profileController {
  async getProfileById(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags = ['Profile']
     */
    const id = req.params.id;
    try {
      const profile = await prisma.profile.findMany({ where: { id } });

      res.status(200).json({
        message: 'Success to fetch data',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags = ['Profile']
    #swagger.security = [{
		 	"bearerAuth" : []
		 }]
     */
    const { userId } = req.params;
    const { fullName, bio, avatar } = req.body;
    try {
      const profile = await prisma.profile.upsert({
        where: { userId },
        update: { fullName, bio, avatar },
        create: { userId, fullName, bio, avatar },
      });

      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
  async deleteProfile(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    /**
    #swagger.tags = ['Profile']
    #swagger.security = [{
		 	"bearerAuth" : []
		 }]
     */
    try {
      await prisma.profile.delete({ where: { userId } });
      res.status(200).json({ message: 'Profile deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export default new profileController();

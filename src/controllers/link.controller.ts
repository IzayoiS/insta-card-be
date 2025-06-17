import { NextFunction, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import linkService from '../services/link.service';

export default {
  async createLink(req: Request, res: Response) {
    /**
    #swagger.tags=['Link']
    #swagger.security = [{
		 	"bearerAuth" : []
		 }]
     */
    try {
      const userId = (req as any).user.id;
      const { title, url, order, visible } = req.body;

      if (!title || !url) {
        res.status(400).json({
          message: 'Title and URL are required',
          data: null,
        });
        return;
      }

      const newLink = await linkService.createLink(userId, {
        title,
        url,
        order,
        visible,
      });

      res.status(201).json({
        message: 'Link created successfully',
        data: newLink,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async getLinks(req: Request, res: Response) {
    /**
    #swagger.tags=['Link']
     */
    try {
      const Links = await prisma.link.findMany();

      res.status(200).json({
        message: 'show all link',
        data: Links,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};

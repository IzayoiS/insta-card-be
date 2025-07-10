import { Request, Response } from 'express';
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

  async getPublicLinks(req: Request, res: Response) {
    /**
     #swagger.tags=['Public']
    */
    const { username } = req.params;
    try {
      const links = await linkService.getLinksByUsername(username);

      if (!links || links.length === 0) {
        res.status(404).json({
          message: 'User or links not found',
          data: null,
        });
        return;
      }

      res.status(200).json({
        message: 'Public links fetched',
        data: links,
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
    const userId = (req as any).user.id;
    try {
      const Links = await linkService.getLinks(userId);

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
  async deleteLink(req: Request, res: Response) {
    /**
    #swagger.tags=['Link']
    #swagger.security = [{
     	"bearerAuth" : []
     }]
     */
    const userId = (req as any).user.id;
    const { id } = req.params;
    try {
      const existingLink = await linkService.getLinkById(id);

      if (existingLink?.userId !== userId) {
        res.status(403).json({
          message: 'You are not allowed to delete this link',
        });
        return;
      }

      await linkService.deleteLink(id);
      res.status(200).json({ message: 'Link deleted' });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async updateLink(req: Request, res: Response) {
    /**
    #swagger.tags=['Link']
    #swagger.security = [{
     	"bearerAuth" : []
     }]
     */
    const userId = (req as any).user.id;
    const { id } = req.params;
    const data = req.body;
    try {
      const existingLink = await linkService.getLinkById(id);

      if (!existingLink) {
        res.status(404).json({
          message: 'Link not found',
          data: null,
        });
        return;
      }

      if (existingLink.userId !== userId) {
        res.status(403).json({
          message: 'You are not allowed to update this link',
          data: null,
        });
        return;
      }
      const updatedLink = await linkService.updateLink(id, data);

      res.status(200).json({
        message: 'Link updated successfully',
        data: updatedLink,
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

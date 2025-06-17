import { NextFunction, Request, Response } from 'express';
import { prisma } from '../prisma/client';

export default {
  async getUsers(req: Request, res: Response) {
    /**
     * #swagger.tags = ['User']
     */
    try {
      const users = await prisma.user.findMany({
        omit: {
          password: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async getUserByUsername(req: Request, res: Response) {
    /**
     #swagger.tags =['User']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/* UpdateUser"}
     }
     */
    const { username } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
        omit: {
          password: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'User is found',
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async updateUser(req: Request, res: Response) {
    /* #swagger.tags = ['User'] 
    #swagger.security = [{
		 	"bearerAuth" : []
		 }]
    */
    /* #swagger.parameters['username'] = {
        in: 'path',
        required: true,
        type: 'string',
  } */
    /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserRequest" }
          }
        }
  } */
    try {
      const { username } = req.params;
      const updateData = req.body;

      const updatedUser = await prisma.user.update({
        where: { username },
        data: updateData,
        omit: { password: true },
      });

      res.status(200).json({
        message: 'user has been update',
        data: updatedUser,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async deleteUserByUsername(req: Request, res: Response) {
    /**
      #swagger.tags = ['User']
      #swagger.security = [{
		 	"bearerAuth" : []
		 }]
     #swagger.parameters['username'] = {
      in: 'path',
      required: true,
      type: 'string'
      }
     */
    try {
      const { username } = req.params;

      await prisma.user.delete({
        where: { username },
      });

      res.status(204).json({ message: 'User is deleted' });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};

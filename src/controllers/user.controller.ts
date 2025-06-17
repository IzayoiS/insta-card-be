import { NextFunction, Request, Response } from 'express';
import { prisma } from '../prisma/client';
import userService from '../services/user.service';

export default {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['User']
     */
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  async getUserById(req: Request, res: Response, next: NextFunction) {
    /**
     #swagger.tags =['User']
     #swagger.requestBody = {
     required: true,
     schema: {$ref: "#/components/schemas/* UpdateUser"}
     }
     */
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'User is found',
        data: user,
      });
    } catch (error) {
      next(error);
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
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await userService.updateUserById(id, updateData);

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
  async deleteUserById(req: Request, res: Response) {
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
      const { id } = req.params;

      const user = await userService.deleteUserById(id);

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

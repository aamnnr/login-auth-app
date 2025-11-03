// server/routes/userRoutes.js

import express from 'express';
import { 
  getAllUsers, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllUsers);    
router.put('/:id', updateUser);  
router.delete('/:id', deleteUser); 

export default router;
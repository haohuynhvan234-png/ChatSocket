import express from 'express';
import { getByRoom, create, remove } from '../controllers/messageController.js';

const router = express.Router();

router.get('/:room', getByRoom);
router.post('/', create);
router.delete('/:id', remove);

export default router;

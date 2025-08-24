import express from 'express';
import ProjectController from '../controllers/projectController';
import e from 'express';


const router = express.Router();

router.post('/', ProjectController.create);
router.get('/', ProjectController.getAll);
router.get('/admin', ProjectController.getAllForAdmin);
router.get('/:id', ProjectController.getById);
router.put('/:id', ProjectController.update);
router.delete('/:id', ProjectController.delete);


export default router;
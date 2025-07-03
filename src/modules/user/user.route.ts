import {
    getUserController,
    createUserController,
    deletedUserController
} from './user.controller';

import express from 'express';
import {validate} from '../../common/middlewares/validate.middleware';
import {createUserSchema} from '../../common/validations/user.validation';
import {
    protect,
    authorize
} from '../../common/middlewares/auth.middleware'

const router = express.Router();

router.get('/' , protect , authorize('admin'),getUserController);
router.post('/' ,validate(createUserSchema), createUserController);
router.delete(':userId' , protect , authorize('admin') , deletedUserController);
export default router;
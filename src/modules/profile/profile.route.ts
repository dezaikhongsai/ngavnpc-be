import {
    getMeController,
    createProfileController,
    updateProfileController
} from './profile.controller';
import express from 'express';

import {
    protect,
} from '../../common/middlewares/auth.middleware';
import {validate} from '../../common/middlewares/validate.middleware';
import {profileSchema} from '../../common/validations/profile.validation';

const router = express.Router();

// Apply protect middleware to all profile routes
router.use(protect);

// Routes
router.get('/me', getMeController);
router.post('/', validate(profileSchema), createProfileController);
router.put('/', validate(profileSchema), updateProfileController);

export default router;

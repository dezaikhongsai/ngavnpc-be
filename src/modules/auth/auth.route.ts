import {
    loginController,
    logoutController,
    refreshTokenController
} from './auth.controller';
import express from 'express';
import {
    protect,
    verifyRefreshToken} from '../../common/middlewares/auth.middleware';
import {validate} from '../../common/middlewares/validate.middleware';
import {loginSchema} from '../../common/validations/auth.validation'
const router = express.Router();

// Route đăng nhập

router.post('/login', validate(loginSchema) , loginController);
router.post('/refresh-token', verifyRefreshToken, refreshTokenController);
router.post('/logout', protect, logoutController);
router.get('/verify-token', protect, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

export default router;
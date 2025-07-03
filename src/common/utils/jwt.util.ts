import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import {envKey} from '../configs/key/key.config'
import type { StringValue } from "ms";

export const genAccessToken = (userId: string): string => {
    const payload = { userId };
    const expiresIn = envKey.jwt.access_expire as StringValue;
    const options: SignOptions = {
        expiresIn, 
    };
    const secret: Secret = envKey.jwt.jwt_access as string;
    return jwt.sign(payload, secret, options);
};

export const genRefreshToken = (userId: string): string => {
    const payload = { userId };
    const expiresIn = (envKey.jwt.refresh_expire) as StringValue;
    const options: SignOptions = {
        expiresIn, 
    };
    const secret: Secret = envKey.jwt.jwt_refresh as string;
    return jwt.sign(payload, secret, options);
}
import {envKey} from '../key/key.config'
export const corsOptions = {
  origin: envKey.fe.url,
  methods: ['GET', 'POST', 'PUT', 'DELETE' , 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

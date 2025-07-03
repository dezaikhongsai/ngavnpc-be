import express from "express";
import cors from "cors";
import {envKey} from './common/configs/key/key.config';
import {errorHandler} from './common/middlewares/errorHandler.middleware';
import connectDB from './common/configs/database/db.config';
import userRoute from './modules/user/user.route';
import authRoute from './modules/auth/auth.route';
import profileRoute from './modules/profile/profile.route';
import customerRoute from './modules/customer/customer.route';
import cookieParser from "cookie-parser";
import {corsOptions} from './common/configs/options/cors.option';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  ...corsOptions,
  exposedHeaders: ['Content-Disposition', 'Content-Type'] 
}));

app.use('/api/v1/user' , userRoute);
app.use('/api/v1/auth' ,authRoute );
app.use('/api/v1/profile' ,profileRoute );
app.use('/api/v1/customer' , customerRoute);
app.get("/", (_req, res) => {
  res.send("Server is running with TypeScript!");
});
app.use(errorHandler);
const PORT = envKey.app.port;

connectDB();
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

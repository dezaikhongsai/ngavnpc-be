import dotenv from 'dotenv';
dotenv.config({ debug: false }); 

// Log số lượng biến môi trường đã load (nếu cần)
if (process.env.NODE_ENV === 'development') {
    console.log(`Loaded ${Object.keys(process.env).length} environment variables`);
}

export const envKey  = {
    app : {
        port : process.env.PORT || 8081,
        passwordSlat : process.env.SLAT || 10
    },
    db : {
        uri : process.env.NODE_ENV==='development'? process.env.MONGO_URI : process.env.MONGO_URI_CLOUD,
        name : process.env.DB_NAME
    },
    enviroment : process.env.NODE_ENV || 'development',
    jwt : {
        jwt_access : process.env.JWT_ACCESS_SECRET,
        jwt_refresh : process.env.JWT_REFRESH_SECRET,
        access_expire : process.env.ACCESS_TOKEN_EXPIRE,
        refresh_expire : process.env.REFRESH_TOKEN_EXPIRE
    },
    cookie : {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'development'? false : true,
        sameSite : process.env.NODE_ENV === 'development' ? 'lax' : 'strict'  as boolean | "lax" | "strict" | "none" | undefined
    }, 
    fe: {
        url : process.env.NODE_ENV === 'development' ? process.env.FE_URL : process.env.FE_URL_PROD
    }
}
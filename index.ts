import Cors from 'cors';
import Express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import swaggerUi from 'swagger-ui-express';
import userController from './src/controllers/user';
import { redisClient } from './src/libs/redis';
import { authenticateToken } from './src/middlewares/authentication';
import { upload } from './src/middlewares/image-thread';
import swaggerDocument from './src/swagger-generated.json';

const port = process.env.PORT || 5000;
export const app = Express();
const router = Express.Router();

// Konfigurasi CORS
const corsOptions = {
    origin: ["https://try-seven-xi.vercel.app"], // URL frontend Vercel kamu
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Mengizinkan pengiriman cookies dan header autentikasi
};

app.use(Cors(corsOptions));

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Redis connected");
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
}

connectRedis();

const swaggerOption = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
    },
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

app.use(Express.urlencoded({ extended: false }));
app.use(Express.json());
app.use("/api/v1", router);
router.use(limiter);
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerOption));

// Endpoint utama
router.get("/", (req, res) => {
    redisClient.set("HELLO", "WORLD");
    res.send("Welcome to API V1");
});

// Endpoint API
router.post("/register", upload.none(), userController.registerUser);
router.post("/login", upload.none(), userController.loginUser);
router.get("/check", authenticateToken, upload.none(), userController.check);

// Tambahkan handler OPTIONS untuk preflight request
router.options("*", Cors(corsOptions));

// Server listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

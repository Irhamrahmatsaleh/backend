import Cors from 'cors';
import Express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import swaggerUi from 'swagger-ui-express';
import followController from './src/controllers/follow';
import threadController from './src/controllers/thread';
import userController from './src/controllers/user';
import { redisClient } from './src/libs/redis';
import { authenticateToken } from './src/middlewares/authentication';
import { upload } from './src/middlewares/image-thread';
import swaggerDocument from './src/swagger-generated.json';

const port = process.env.PORT || 5000;
export const app = Express();
const router = Express.Router();

async function connectRedis() {
    await redisClient.connect();
}

connectRedis();
const swaggerOption = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true
    }
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

app.use(Express.urlencoded({ extended: false }));
app.use(Express.json());
// app.use(Cors())
app.use(Cors({
    origin: 'http://localhost:5173', // Ganti dengan domain frontend Anda
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}));
app.use("/api/v1", router);
router.use(limiter);
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerOption));

//v1
router.get("/", (req, res) => {
    redisClient.set("HELLO", "WORLD");
    res.send("Welcome to API V1");
})

router.post("/register", upload.none(), userController.registerUser);
router.post("/login", upload.none(), userController.loginUser);
router.get("/check", authenticateToken, upload.none(), userController.check);
router.get("/user", authenticateToken, upload.none(), userController.findUser);
router.get("/user:id", authenticateToken, upload.none(), userController.findUserID)
router.get("/verify-email/:token", userController.verifyEmail);
router.post("/request-password", upload.none(), userController.requestPassword);
router.post("/reset-password/:token", upload.none(), userController.resetPassword);

router.patch("/user", authenticateToken, upload.single('photo_profile'), userController.updateUser);
router.delete("/user:id", authenticateToken, userController.deleteUser);

router.get("/thread", authenticateToken,
    // async (req: Request, res: Response, next: NextFunction) => {
    //     const result = await redisClient.get("ALL_THREADS_DATA");
    //     if (result) return res.json(JSON.parse(result));

    //     next();
    // },
    upload.none(), threadController.findAllThread)
router.get("/threadProfile", authenticateToken, upload.none(), threadController.findUserThread)
router.get("/otherThread:id", authenticateToken, upload.none(), threadController.findOtherUserThread)
router.get("/thread:id", authenticateToken, upload.none(), threadController.findIDThread)
router.post("/threadPost", authenticateToken, upload.single('image'), threadController.postThread)
router.patch("/thread:id", authenticateToken, upload.none(), threadController.updateThread)
router.delete("/thread:id", authenticateToken, threadController.deleteThread)
router.get("/image", authenticateToken, upload.none(), threadController.findImage)

router.get("/like:id", authenticateToken, upload.none(), threadController.setLikedID)
router.get("/unlike:id", authenticateToken, upload.none(), threadController.setUnlikedID)
router.get("/lreplies:id", authenticateToken, upload.none(), threadController.setLikedReplies)
router.get("/ulreplies:id", authenticateToken, upload.none(), threadController.setUnlikedReplies)

router.get("/replies:id", authenticateToken, upload.none(), threadController.findRepliesID)
router.get("/singlereplies:id", authenticateToken, upload.none(), threadController.findSingleRepliesID)
router.get("/childrenreplies:id", authenticateToken, upload.none(), threadController.findChildrenRepliesID)
router.post("/replies:id", authenticateToken, upload.single('image'), threadController.postReplies)
router.post("/childrenreplies:id", authenticateToken, upload.single('image'), threadController.postRepliesChildren)
router.delete("/replies:id", authenticateToken, threadController.deleteReply)

router.get("/search", authenticateToken, upload.none(), followController.fetchSearchedUser)
router.get("/following", authenticateToken, upload.none(), followController.fetchFollowing)
router.get("/follower", authenticateToken, upload.none(), followController.fetchFollower)
router.get("/suggested", authenticateToken, upload.none(), followController.fetchRandomUserSuggestion)
router.get("/follow:id", authenticateToken, upload.none(), followController.setFollowID)
router.get("/unfollow:id", authenticateToken, upload.none(), followController.setUnfollowID)


app.listen(port, () => {
    console.log(`Port ${port} is listening`)
})

import express from "express";
import config from "./config";
import usersRouter from "./routes/users/users";
import cors from "cors";
import { TMA_authMiddleware } from "./middleware/auth";
import { defaultErrorMiddleware } from "./middleware/error";
import keysRouter from "./routes/keys/keys";

const app = express();

app.use(express.json());

app.use(
    cors({
        // Can use 172, 10, 192 classes because they are local network classes
        origin:
            config.nodeEnv === "development"
                ? [
                      "https://172.20.10.2:5173",
                      "https://10.7.0.2:5173",
                      "https://192.168.50.184:5173",
                      "https://127.0.0.1:5173",
                      "https://localhost:5173",
                  ]
                : config.tmaDomain, // your Mini App’s domain
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.use(TMA_authMiddleware);

app.use(usersRouter);
app.use(keysRouter);

app.use(defaultErrorMiddleware);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}...`);
});

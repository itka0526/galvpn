import express from "express";
import config from "./config";
import prisma from "./db";

const app = express();

app.use(express.json());

app.use((_, res) => {
    res.status(500).json({
        message: "Internal Server Error",
    });
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}...`);
});

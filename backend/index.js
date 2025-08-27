"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.send("Hello, TypeScript Express!");
});
app.use((_, res) => {
    res.status(500).json({
        message: "Internal Server Error",
    });
});
app.listen(config_1.default.port, () => {
    console.log(`Server is running on port ${config_1.default.port}...`);
});

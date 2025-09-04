"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middleware/errorHandler");
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// ✅ Correct CORS config for local frontend at localhost:3000
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // header names only
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/projects', projectRoutes_1.default);
app.use(errorHandler_1.errorHandler);
app.get('/', (req, res) => {
    res.send('Hello from Nodemon + TypeScript!');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

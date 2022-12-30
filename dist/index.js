"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const record_router_1 = __importDefault(require("./Record/record.router"));
const auth_router_1 = __importDefault(require("./Auth/auth.router"));
const globalError_controller_1 = __importDefault(require("./Error/globalError.controller"));
const appError_1 = __importDefault(require("./utils/appError"));
require("express-async-errors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv.config();
// If there is no port defined in the environment variables, exit the process
if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/records', record_router_1.default);
app.use('/api/auth', auth_router_1.default);
app.get('/', (request, response, next) => {
    response.send('Project Valkyrie!');
});
app.get('/api/healthcheck', (request, response) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date(),
        info: 'Project Valkyrie. For more information visit, https://github.com/AlexMNet/project-valkyrie-api',
    };
    response.status(200).send(data);
});
app.all('*', (request, response, next) => {
    next(new appError_1.default(404, 'Sorry, this endpoint cannot be found.'));
});
app.use(globalError_controller_1.default);
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} in ${process.env.NODE_ENV} mode...`);
});

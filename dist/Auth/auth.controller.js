"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.authorization = exports.registerUser = exports.loginUser = void 0;
const db_server_1 = require("../utils/db.server");
const appError_1 = __importDefault(require("../utils/appError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const loginUser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const user = yield db_server_1.db.user.findUnique({ where: { email } });
    if (!user)
        return next(new appError_1.default(400, 'user not found'));
    const pwMatch = yield argon2_1.default.verify(user.password, password);
    if (!pwMatch) {
        return next(new appError_1.default(400, 'password or email is invalid'));
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, 'thisisasecret');
    return response
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json({ status: 'success', message: 'login successful' });
});
exports.loginUser = loginUser;
const registerUser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName } = request.body;
    const hashedPassword = yield argon2_1.default.hash(request.body.password);
    const user = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
    };
    const newUser = yield db_server_1.db.user.create({
        data: user,
        select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
        },
    });
    const token = jsonwebtoken_1.default.sign({ id: newUser.id }, 'thisisasecret');
    response
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json({ status: 'success', message: 'login successful' });
});
exports.registerUser = registerUser;
const authorization = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = request.cookies.access_token;
    if (!token)
        return next(new appError_1.default(403, 'please log in to view this page'));
    const decoded = jsonwebtoken_1.default.verify(token, 'thisisasecret');
    request.user = decoded;
    next();
});
exports.authorization = authorization;
const logout = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    response
        .clearCookie('access_token')
        .status(200)
        .json({ status: 'success', message: 'successfully logged out' });
});
exports.logout = logout;

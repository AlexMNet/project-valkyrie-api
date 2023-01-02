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
exports.resetPassword = exports.forgotPassword = exports.logout = exports.adminOnly = exports.authorization = exports.registerUser = exports.loginUser = void 0;
const db_server_1 = require("../utils/db.server");
const appError_1 = __importDefault(require("../utils/appError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const email_1 = require("../utils/email");
const helpers_1 = require("../utils/helpers");
const auth_services_1 = require("./auth.services");
/**
 * Login User
 */
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield db_server_1.db.user.findUnique({ where: { email } });
    if (!user)
        return next(new appError_1.default(400, 'user not found'));
    const pwMatch = yield argon2_1.default.verify(user.password, password);
    if (!pwMatch) {
        return next(new appError_1.default(400, 'password or email is invalid'));
    }
    const token = (0, auth_services_1.signToken)({ id: user.id, role: user.role });
    (0, auth_services_1.sendResponse)(res, 200, 'login successful', token);
});
exports.loginUser = loginUser;
/**
 * Register User
 */
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, password } = req.body;
    const hashedPassword = yield argon2_1.default.hash(password);
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
    const token = (0, auth_services_1.signToken)({ id: newUser.id, role: newUser.role });
    (0, auth_services_1.sendResponse)(res, 200, 'registration successfull', token);
});
exports.registerUser = registerUser;
/**
 * Authorization
 */
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.cookies.access_token;
    if (!token)
        return next(new appError_1.default(403, 'please log in to view this page'));
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
});
exports.authorization = authorization;
/**
 *  Check if Admin
 */
const adminOnly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== 'ADMIN') {
        return next(new appError_1.default(401, 'You must be an admin to access this resource'));
    }
    return next();
});
exports.adminOnly = adminOnly;
/**
 * Logout
 */
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie('access_token')
        .status(200)
        .json({ status: 'success', message: 'successfully logged out' });
});
exports.logout = logout;
/**
 * Forgot Password
 */
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield db_server_1.db.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return next(new appError_1.default(404, 'User does not exist with that email'));
    }
    const resetToken = (0, auth_services_1.createResetToken)();
    yield db_server_1.db.user.update({
        where: {
            id: user.id,
        },
        data: {
            passwordResetToken: (0, auth_services_1.hashResetToken)(resetToken),
            passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
    const resetURL = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a patch request to ${resetURL} with your new password. \n If this wasn't you, please change your password!`;
    try {
        yield (0, email_1.sendEmail)({
            email: user.email,
            subject: 'Your password reset token is valid for 10 minutes',
            message,
        });
    }
    catch (err) {
        return next(new appError_1.default(500, 'Something went wrong. Email could not be sent. Try again later.'));
    }
    (0, auth_services_1.sendResponse)(res, 200, `Reset token send to ${(0, helpers_1.obscureEmail)(user.email)}`);
});
exports.forgotPassword = forgotPassword;
/**
 * Reset Password
 */
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = (0, auth_services_1.hashResetToken)(token);
    const user = yield db_server_1.db.user.findFirst({
        where: {
            passwordResetToken: {
                equals: hashedToken,
            },
            passwordResetExpires: {
                gt: new Date(),
            },
        },
    });
    if (!user) {
        return next(new appError_1.default(404, 'Token invalid or expired'));
    }
    const updateUser = yield db_server_1.db.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: yield argon2_1.default.hash(password),
            passwordResetToken: null,
            passwordResetExpires: null,
        },
    });
    const jwtToken = (0, auth_services_1.signToken)({ id: user.id, role: user.role });
    (0, auth_services_1.sendResponse)(res, 200, 'password reset', jwtToken);
});
exports.resetPassword = resetPassword;

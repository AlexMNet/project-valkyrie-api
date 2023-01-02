"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const auth_controller_1 = require("./auth.controller");
const auth_validator_1 = require("./auth.validator");
const auth_controller_2 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/login', auth_validator_1.validateLogin, auth_controller_1.loginUser);
router.post('/register', auth_validator_1.validateRegister, auth_controller_1.registerUser);
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.post('/reset-password/:token', auth_controller_1.resetPassword);
router.get('/logout', auth_controller_2.authorization, auth_controller_1.logout);
exports.default = router;

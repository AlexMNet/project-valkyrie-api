"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const record_controller_1 = require("./record.controller");
const validation_1 = require("./validation");
const auth_controller_1 = require("../Auth/auth.controller");
const router = express_1.default.Router();
//Get all records
router.get('/', auth_controller_1.authorization, record_controller_1.getAllRecords);
//Create a record
router.post('/', auth_controller_1.authorization, validation_1.validateCreateRecord, record_controller_1.createRecord);
//Get a single record
router.get('/:id', auth_controller_1.authorization, record_controller_1.getRecordById);
//Update a single record
router.put('/:id', auth_controller_1.authorization, record_controller_1.updateRecord);
//Delete a single record
router.delete('/:id', auth_controller_1.authorization, record_controller_1.deleteRecord);
exports.default = router;

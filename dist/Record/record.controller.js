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
exports.deleteRecord = exports.updateRecord = exports.getRecordById = exports.createRecord = exports.getAllRecords = void 0;
const db_server_1 = require("../utils/db.server");
const appError_1 = __importDefault(require("../utils/appError"));
const getAllRecords = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield db_server_1.db.record.findMany({
        where: { authorId: request.user.id },
    });
    return response.status(200).json({ status: 'success', data: records });
});
exports.getAllRecords = getAllRecords;
const createRecord = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = request.body;
    const newRecord = yield db_server_1.db.record.create({
        data: {
            title,
            authorId: request.user.id,
        },
        select: {
            id: true,
            title: true,
        },
    });
    return response.status(200).json({ status: 'success', data: newRecord });
});
exports.createRecord = createRecord;
const getRecordById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id, 10);
    const record = yield db_server_1.db.record.findFirst({
        where: {
            id,
            authorId: request.user.id,
        },
        select: {
            id: true,
            title: true,
            authorId: true,
        },
    });
    if (!record) {
        // throw Error('No Record Found!');
        return next(response.status(404).json({ message: 'No record Found!' }));
    }
    return response.status(200).json({ status: 'success', data: [record] });
});
exports.getRecordById = getRecordById;
const updateRecord = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id, 10);
    const record = yield db_server_1.db.record.findFirst({
        where: {
            id,
            authorId: request.user.id,
        },
        select: {
            id: true,
            title: true,
            authorId: true,
        },
    });
    if (!record)
        return next(new appError_1.default(400, 'record not found'));
    const updatedRecord = yield db_server_1.db.record.update({
        where: {
            id,
        },
        data: request.body,
        select: {
            id: true,
            title: true,
            authorId: true,
        },
    });
    return response.status(200).json(updatedRecord);
});
exports.updateRecord = updateRecord;
const deleteRecord = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id, 10);
    const record = yield db_server_1.db.record.findFirst({
        where: {
            id,
            authorId: request.user.id,
        },
        select: {
            id: true,
            title: true,
            authorId: true,
        },
    });
    if (!record)
        return next(new appError_1.default(400, 'record not found'));
    const deletedRecord = yield db_server_1.db.record.delete({
        where: {
            id,
        },
    });
    return response.status(200).json({ message: 'Record successfully deleted' });
});
exports.deleteRecord = deleteRecord;

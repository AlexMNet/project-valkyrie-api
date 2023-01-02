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
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield prisma.user.createMany({
            data: [
                {
                    firstName: 'Danny',
                    lastName: 'Contreras',
                    email: 'danny@gmail.com',
                    password: yield argon2_1.default.hash('ilovekritzia'),
                },
                {
                    firstName: 'Alex',
                    lastName: 'Maldonado',
                    email: 'alex@gmail.com',
                    password: yield argon2_1.default.hash('testing123'),
                },
                {
                    firstName: 'Shiany',
                    lastName: 'Maldonado',
                    email: 'shiany@gmail.com',
                    password: yield argon2_1.default.hash('ilovealexm'),
                    role: 'ADMIN',
                },
            ],
        });
        const danny = yield prisma.user.findUnique({
            where: { email: 'danny@gmail.com' },
        });
        const dannyRecords = yield prisma.record.createMany({
            data: [
                { title: 'Patient Zero', authorId: danny === null || danny === void 0 ? void 0 : danny.id },
                { title: 'Patient Overwatch', authorId: danny === null || danny === void 0 ? void 0 : danny.id },
                { title: 'Patient Sigma', authorId: danny === null || danny === void 0 ? void 0 : danny.id },
            ],
        });
        const alex = yield prisma.user.findUnique({
            where: { email: 'alex@gmail.com' },
        });
        const alexRecords = yield prisma.record.createMany({
            data: [
                { title: 'Patient Valkyrie', authorId: alex === null || alex === void 0 ? void 0 : alex.id },
                { title: 'Patient TRex', authorId: alex === null || alex === void 0 ? void 0 : alex.id },
                { title: 'Patient Baptiste', authorId: alex === null || alex === void 0 ? void 0 : alex.id },
            ],
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(e);
    yield prisma.$disconnect();
    process.exit(1);
}));

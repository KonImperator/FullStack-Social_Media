"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.MONGO_URI;
async function initDB() {
    try {
        const db = (await mongoose_1.default.connect(connectionString)).connection;
        db.on('open', () => console.log('DB connected successfully'));
        db.on('error', (err) => console.error(err));
        db.on('disconnect', () => console.log('DB has disconnected'));
    }
    catch (error) {
        console.error(error);
        return process.exit(1);
    }
}
exports.initDB = initDB;
//# sourceMappingURL=dbConfig.js.map
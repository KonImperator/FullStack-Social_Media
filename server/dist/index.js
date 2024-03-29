"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appConfig_1 = require("./config/appConfig");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, appConfig_1.init)(app);
app.listen(port, () => console.log('Server is listening on port ' + port));
//# sourceMappingURL=index.js.map
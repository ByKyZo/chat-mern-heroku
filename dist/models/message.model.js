"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// const date: String = new Date().toString().replace('-','/');
const MessageShema = new mongoose_1.Schema({
    user: {
        type: Object,
        required: true
    },
    channelID: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    date: {
        type: String,
    },
    hour: {
        type: String,
    }
});
MessageShema.pre('save', function (next) {
    this.date = new Date().toLocaleDateString();
    // this.date = '24/04/2021';
    this.hour = new Date().toLocaleTimeString().substring(0, 5);
    next();
});
exports.default = mongoose_1.default.model('message', MessageShema);

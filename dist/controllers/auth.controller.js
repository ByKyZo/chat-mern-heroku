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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user_model_1 = __importDefault(require("../models/user.model"));
class AuthController {
    // private static createToken (userID: String) {
    //       UserModel.findByIdAndUpdate(
    //                 userID, 
    //                 {
    //                     $set : {
    //                         remember_me_token : uuidv4()
    //                     }
    //                 },
    //                 (err , docs) => {
    //                     return err ? err : docs;
    //                 }
    //             )
    // }
    static signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pseudo, email, password } = req.body;
            const emailAlreadyExist = yield user_model_1.default.findOne({ email });
            if (emailAlreadyExist)
                return res.status(500).send('Error email already exist');
            const salt = yield bcrypt_1.default.genSalt();
            const passwordHash = yield bcrypt_1.default.hash(password, salt);
            const user = yield user_model_1.default.create({
                pseudo,
                email,
                password: passwordHash
            }, (err, docs) => {
                if (err)
                    return res.status(500).send('SignUp error : ' + err);
                res.status(200).send(docs);
            });
        });
    }
    static signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield user_model_1.default.findOne({ email });
            if (!user)
                return res.status(401).send('Emain doesn\'t exist');
            bcrypt_1.default.compare(password, user.password, (err, same) => __awaiter(this, void 0, void 0, function* () {
                if (!same)
                    return res.status(401).send('Wrong password');
                user_model_1.default.findByIdAndUpdate(user._id, {
                    $set: {
                        remember_me_token: uuid_1.v4()
                    },
                }, {
                    new: true
                }, (err, docs) => {
                    if (err)
                        return res.status(500).send('TOKEN ERROR');
                    res.send(docs);
                });
            }));
        });
    }
    static rememberMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rememberMeToken = req.cookies.REMEMBER_ME;
            user_model_1.default.findOneAndUpdate({ remember_me_token: rememberMeToken }, {
                $set: {
                    remember_me_token: uuid_1.v4()
                },
            }, { new: true }, (err, docs) => {
                if (err)
                    return res.status(500).send('TOKEN ERROR');
                res.send(docs);
            });
        });
    }
}
exports.default = AuthController;

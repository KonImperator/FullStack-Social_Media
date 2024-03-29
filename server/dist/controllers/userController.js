"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.toggleFollow = exports.toggleAddFriend = exports.toggleSendFriendRequest = exports.getUserPhotos = exports.deletePhoto = exports.postPhotos = exports.updateProfilePicture = exports.updatePassword = exports.updateProfile = exports.getFriendStatus = exports.getProfile = void 0;
const userService = __importStar(require("../services/userService"));
const helpers_1 = require("../utils/helpers");
const errorHandler_1 = require("../utils/errorHandler");
const Constants_1 = require("../Constants");
const getProfile = async (req, res, next) => {
    const loggedInUserId = req.user._id;
    const { userId } = req.params;
    try {
        const userData = await userService.fetchProfileData(loggedInUserId, userId);
        res.status(200).json(userData);
    }
    catch (error) {
        res.status(404).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.getProfile = getProfile;
const getFriendStatus = async (req, res, next) => {
    const loggedInUserId = req.user._id;
    const { userId } = req.params;
    try {
        const result = await userService.fetchFriendStatus(loggedInUserId, userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.getFriendStatus = getFriendStatus;
const updateProfile = async (req, res, next) => {
    const trimmedBody = (0, helpers_1.trimmer)(req.body);
    const { username, email, password, bio } = trimmedBody;
    const data = { username, email, password, bio };
    try {
        const user = await userService.editProfile(data, req.user._id);
        return res.status(200).json(user.toObject());
    }
    catch (error) {
        res.status(400).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res, next) => {
    const trimmedBody = (0, helpers_1.trimmer)(req.body);
    const { password, newPassword, confirmPass } = trimmedBody;
    const data = { password, newPassword, confirmPass };
    try {
        await userService.editPassword(data, req.user._id);
        res.status(200).json({ message: Constants_1.passwordUpdateSuccessMessage });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updatePassword = updatePassword;
const updateProfilePicture = async (req, res, next) => {
    const { profilePicture } = req.body;
    try {
        if (!profilePicture) {
            return res.status(400).json({ message: Constants_1.fileUploadNotFoundMessage });
        }
        const user = await userService.editProfilePicture(profilePicture, req.user._id);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.updateProfilePicture = updateProfilePicture;
const postPhotos = async (req, res, next) => {
    const images = req.files || [];
    try {
        const imageData = await userService.uploadPhotos(images, req.user._id);
        res.status(200).json(imageData);
    }
    catch (error) {
        res.status(400).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.postPhotos = postPhotos;
const deletePhoto = async (req, res, next) => {
    const { url } = req.body;
    try {
        const photos = await userService.deletePhoto(url, req.user._id);
        res.status(200).json(photos);
    }
    catch (error) {
        res.status(400).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.deletePhoto = deletePhoto;
const getUserPhotos = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const photos = await userService.fetchPhotos(userId) || [];
        res.status(200).json(photos);
    }
    catch (error) {
        res.status(400).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.getUserPhotos = getUserPhotos;
const toggleSendFriendRequest = async (req, res, next) => {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;
    try {
        const updatedUser = await userService.toggleFriendshipRequest(loggedInUserId, userId);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.toggleSendFriendRequest = toggleSendFriendRequest;
const toggleAddFriend = async (req, res, next) => {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;
    try {
        const updatedUser = await userService.toggleFriendship(loggedInUserId, userId);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.toggleAddFriend = toggleAddFriend;
const toggleFollow = async (req, res, next) => {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;
    try {
        await userService.toggleFollowUser(loggedInUserId, userId);
        res.status(200).json({ message: Constants_1.userFollowSuccess });
    }
    catch (error) {
        res.status(400).json((0, errorHandler_1.errorHandler)(error));
    }
};
exports.toggleFollow = toggleFollow;
//# sourceMappingURL=userController.js.map
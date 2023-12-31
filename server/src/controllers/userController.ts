import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { trimmer } from '../utils/trimmer';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userData = await userService.fetchProfileData(req.user!._id);
        res.status(200).json({user: userData});
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const trimmedBody = trimmer(req.body);
    const { username, email, password, bio } = trimmedBody;
    const data = { username, email, password, bio };

    try {
        const user = await userService.editProfile(data, req.user!._id);
        return res.status(200).json(user.toObject());
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const trimmedBody = trimmer(req.body);
    const { password, newPassword, confirmPass } = trimmedBody;
    const data = { password, newPassword, confirmPass };

    try {
        await userService.editPassword(data, req.user!._id);
        res.status(200).json({message: 'Password updated successfully'})
    } catch (error: any) {
        res.status(400).json({message: error.message})
    }
}

export const updateProfilePicture = async (req: Request, res: Response) => {
    const trimmedBody = trimmer(req.body);
    const profilePicture = trimmedBody.profilePicture;
    try {
        if (!profilePicture || !profilePicture.startsWith('http://')) {
            return res.status(400).json({message: 'Invalid profile picture format'});
        }
        const user = await userService.editProfilePicture(profilePicture, req.user!._id)
        res.status(200).json(user.toObject());
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export const postPhotos = async (req: Request, res: Response) => {
    const trimmedBody = trimmer(req.body);
    const photos = trimmedBody.photos;
    try {
        if (photos.length === 0) {
            return res.status(400).json({message: 'Invalid photo URL format'});
        }
        const data = await userService.uploadPhotos(photos, req.user!._id)
        res.status(200).json(data!.toObject());
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export const getUserPhotos = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const photos = await userService.fetchPhotos(userId) || [];
        res.status(200).json(photos);
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export const toggleSendFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const otherUserId = req.params.userId;

    try {
        await userService.toggleFriendshipRequest(userId, otherUserId);
        res.status(200).json({message: 'Friend request successful'});
    } catch (error: any) {
        res.status(400).json({message: error.message})
    }
}

export const denyFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const otherUserId = req.params.userId;

    try {
        await userService.removeFriendshipRequest(userId, otherUserId);
        res.status(200).json({message: 'Friend request removed successfully'});
    } catch (error: any) {
        res.status(400).json({message: error.message})
    }
}

export const toggleAddFriend = async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const otherUserId = req.params.userId;

    try {
        await userService.toggleFriendship(userId, otherUserId);
        res.status(200).json({message: 'Add/Remove friend successful'});
    } catch (error: any) {
        res.status(400).json({message: error.message})
    }
}

export const toggleFollow = async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const otherUserId = req.params.userId;
    
    try {
        await userService.toggleFollowUser(userId, otherUserId);
        res.status(200).json({message: 'User followed successfully'});
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}


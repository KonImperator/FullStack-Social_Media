import { User } from "../models/User";
import { comparePasswords, hashPassword, savePhotos } from "./helpers/serviceHelpers";
import { ProfileData, Passwords } from "./types/types";

export const editProfile = async (data: ProfileData, userId: string) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    if (!(await comparePasswords(data.password!, user.password))) {
        throw new Error('Incorrect password');
    }

    user.email = data.email
    user.bio = data.bio;
    user.username = data.username;

    await user.save();
    return user;
}

export const editPassword = async (passwords: Passwords, userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (!(await comparePasswords(passwords.password, user.password))) {
        throw new Error('Incorrect password')
    }

    if (passwords.newPassword !== passwords.confirmPass){
        throw new Error('Passwords must match');
    }

    user.password = await hashPassword(passwords.newPassword);
    await user.save();
}

export const editProfilePicture = async (profilePicture: string, userId: string) => {
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture}, {new: true}).select('profilePicture');
    if (!updatedUser) {
        throw new Error('Profile picture update failed. Invalid user');
    }
    return updatedUser;
}

export const toggleFriendshipRequest = async (loggedInUserId: string, otherUserId: string) => {

    if (loggedInUserId === otherUserId) {
        throw new Error('Cannot request friendship with self');
    }

    const [loggedInUser, otherUser] = await Promise.all([User.findById(loggedInUserId), User.findById(otherUserId)])

    if (!loggedInUser || !otherUser) {
        throw new Error('User not found');
    }

    if (loggedInUser.friends.includes(otherUserId)){
        throw new Error('Users are already friends');
    }

    if (loggedInUser.friendRequests.sent.includes(otherUserId) || loggedInUser.friendRequests.received.includes(otherUserId)) {
         
        const [_, result] = await Promise.all(
            [
                User.updateOne({_id: otherUserId}, {$pull: {'friendRequests.received': loggedInUserId,'friendRequests.sent': loggedInUserId }}),
                User.findByIdAndUpdate(loggedInUserId, {$pull: {'friendRequests.received': otherUserId,'friendRequests.sent': otherUserId }}, {new: true})
                    .select('friendRequests.received friendRequests.sent friends')
                    .populate('friendRequests.received friends', 'username profilePicture')
            ]);

            return result;
    } else {
        const [_, result] = await Promise.all(
                [
                    User.updateOne({_id: otherUserId}, {$push: {'friendRequests.received': loggedInUserId}}),
                    User.findByIdAndUpdate(loggedInUserId, {$push: {'friendRequests.sent': otherUserId}}, {new: true})
                        .select('friendRequests.received friendRequests.sent friends')
                        .populate('friendRequests.received friends', 'username profilePicture')
                ]
            );

            return result;
    }
}

export const toggleFriendship = async (loggedInUserId: string, otherUserId: string) => {
    
    if (loggedInUserId === otherUserId) {
        throw new Error('Can\'t befriend self');
    }

    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser) {
        throw new Error('User not found');
    }

    if (loggedInUser.friends.includes(otherUserId)){
        const [_, result] = await Promise.all([
            User.updateOne({_id: otherUserId}, {$pull: {friends: loggedInUserId}}),
            User.findByIdAndUpdate(loggedInUserId, {$pull: {friends: otherUserId}}, {new: true})
                .select('friendRequests.received friendRequests.sent friends')
                .populate('friendRequests.received friends', 'username profilePicture')
        ]);
        return result;

    } else if (loggedInUser.friendRequests.received.includes(otherUserId)) {
        const [_, result] = await Promise.all(
        [
            User.updateOne({_id: otherUserId}, {$push: {friends: loggedInUserId}, $pull: {'friendRequests.sent': loggedInUserId}}),
            User.findByIdAndUpdate(loggedInUserId, {$push: {friends: otherUserId}, $pull: {'friendRequests.received': otherUserId}}, {new: true})
                .select('friendRequests.received friendRequests.sent friends')
                .populate('friendRequests.received friends', 'username profilePicture')
        ]);
        return result
    }
}

export const toggleFollowUser = async (loggedInUserId: string, otherUserId: string) => {
    if (loggedInUserId === otherUserId) {
        throw new Error('Can\'t follow self');
    }

    const users = (await User.find({_id: {$in: [loggedInUserId, otherUserId]}}));

    if (users.length !== 2 || !users[0] || !users[1]) {
        throw new Error('One or more of requested users not found');
    }

    const loggedInUser = users.find((user) => user._id!.toString() === loggedInUserId);
    const otherUser = users.find((user) => user._id!.toString() === otherUserId);

    let result;

    if (loggedInUser!.following.includes(loggedInUserId)) {
        result = await Promise.all([
            User.updateOne({_id: loggedInUserId}, {$pull: {following: otherUserId}}),
            User.updateOne({_id: otherUserId}, {$pull: {followers: loggedInUserId}}),
        ]);
    } else {
        result = await Promise.all([
            User.updateOne({_id: loggedInUserId}, {$push: {following: otherUserId}}),
            User.updateOne({_id: otherUserId}, {$push: {followers: loggedInUserId}}),
        ]);
    }

    if (result[0].modifiedCount === 0 || result[1].modifiedCount === 0) {
        throw new Error('Follow operation had no effect. Perform database integrity check');
    }
}

export const uploadPhotos = async (photos: Express.Multer.File[], userId: string) => {
    const imageUrls = await savePhotos(photos, userId);
    const images = await User.findByIdAndUpdate(userId, { 
        $push: { 
            photos: { 
                $each: imageUrls.map(url => ({ url })) } } }, 
        {new: true}).select('photos');
    
    return images;
}

export const fetchPhotos = async (userId: string) => {
    return await User.findById(userId).select('photos');
}

export const deletePhoto = async (url: string, userId: string) => {
    return await User.findByIdAndUpdate(userId, {$pull: {photos: { url }}}, {new: true}).select('photos');
}

export const fetchProfileData = async (loggedInUserId: string, userId: string ) => {
    const fields = 'username bio profilePicture photos gender friends following followers';

    if (userId === loggedInUserId) {
        return await User.findById(userId).select(fields + ' friendRequests')
        .populate('friends friendRequests.received', 'username profilePicture');
    } else {
        return await User.findById(userId).select(fields).populate('friends', 'username profilePicture');
    }
}

export const fetchFriendStatus: (id1: string, id2: string) => Promise<string>  = async (loggedInUserId: string, otherUserId: string) => {

    const loggedInUser = await User.findById(loggedInUserId).select('friendRequests friends');

    if (loggedInUser!.friendRequests.received.includes(otherUserId)){
        return 'received';
    } 

    if (loggedInUser!.friendRequests.sent.includes(otherUserId)) {
        return 'sent';
    }
    
    if (loggedInUser!.friends.includes(otherUserId)) {
        return 'friends';
    }
    
    return 'none';
}
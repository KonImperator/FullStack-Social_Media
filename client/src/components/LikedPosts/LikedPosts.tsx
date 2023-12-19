import LikedPost from './LikedPost/LikedPost';
import './LikedPosts.css';

export type PostData = {
    _id: string;
    text: string;
    imageUrls: string[];
    likeCount: number;
    commentCount: number;
    _ownerId: string;
    _createdAt: string;
};

const author = {
    username: 'KonImperator',
    avatar: 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745',
};

const post: PostData = {
    _id: '1',
    text: `3a всички фенове на гейминг турнирите, които ще посетят AniFest
   2023 - Коледно Издание - rp. Варна, сме подготвили специални
   коледни, мини турнири на League of Legends c любезната подкрепа
   на Acer ❤️ Повече на нашият сайт ⬇⬇⬇`,
    imageUrls: [
        'https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aHVtYW58ZW58MHx8MHx8fDA%3D',
    ],
    likeCount: Math.floor(Math.random() * (10000 - 1) + 1),
    commentCount: Math.floor(Math.random() * (200 - 1) + 1),
    _createdAt: String(Math.floor(Math.random() * (59 - 1) + 1)),
    _ownerId: '1',
};
export default function LikedPosts() {
    const posts: PostData[] = [post];

    return (
        <section className="liked-posts">
            <h1 className='liked-posts-heading'>Liked Posts</h1>
            <LikedPost />
            <LikedPost />
            <LikedPost />
        </section>
    );
}

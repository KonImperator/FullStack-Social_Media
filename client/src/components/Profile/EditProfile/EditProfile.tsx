import { useState } from 'react';
import './EditProfile.css';

export default function EditProfile() {
    const user = {
        username: 'KonImperator',
        email: 'konimperator@abv.bg',
        bio: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo rem temporibus ipsa, nam neque aliquam corrupti nulla facilis illo deserunt sapiente voluptatem unde sed assumenda nobis optio omnis. Dolorem, accusantium!`,
    };

    const [username, setUsername] = useState<string>(user.username);
    const [email, setEmail] = useState<string>(user.email);
    const [bio, setBio] = useState<string>(user.bio);
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(username, email, bio);
    };

    return (
        <section className="form-positioner">
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">Edit Profile</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />
                </div>
                {user.email !== email ? (
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                ) : null}

                <button type="submit" className="submit-btn">
                    Update
                </button>
            </form>
        </section>
    );
}

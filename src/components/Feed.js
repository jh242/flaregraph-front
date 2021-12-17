import Interweave from 'interweave';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

import './Feed.css';

export default function Feed() {
    const [posts, setPosts] = useState();

    useEffect(() => {
        async function init() {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_WORKER}/posts`);
            const parsedPosts = await response.json();
            parsedPosts.sort((a, b) => (b.timestamp-a.timestamp));

            setPosts(parsedPosts);
        }
        
        init();
    }, []);

    return (
        <div className="feed">
            {posts ? posts.map((post) => (
                <Card key={post.postId}>
                    <Card.Body>
                        <Card.Title>
                            {post.title}
                        </Card.Title>
                        <Card.Subtitle>
                            {`${post.username} on ${new Date(post.timestamp).toLocaleDateString()} at ${new Date(post.timestamp).toLocaleTimeString()}`}
                        </Card.Subtitle>
                        <Card.Text>
                            <Interweave content={post.content} />
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        This is a footer for all your footer needs
                    </Card.Footer>
                </Card>
            )) : null}
        </div>
    );
}
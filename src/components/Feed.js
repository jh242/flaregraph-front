import Interweave from "interweave";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Card from "react-bootstrap/Card";

import "./Feed.css";
import { BsHeart, BsChat } from "react-icons/bs";

function Post({ post }) {
    const [commenting, setCommenting] = useState(false);

    return (
        <Card key={post.postId}>
            <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Subtitle>
                {`${post.username} on ${new Date(
                post.timestamp
                ).toLocaleDateString()} at ${new Date(
                post.timestamp
                ).toLocaleTimeString()}`}
            </Card.Subtitle>
            <Card.Text>
                <Interweave content={post.content} />
            </Card.Text>
            </Card.Body>
            <Card.Footer>
            <div className="footerButtons">
                <button>
                    <BsHeart color="white" />
                </button>
                <button>
                    <BsChat color="white" onClick={() => setCommenting(!commenting)} />
                </button>
            </div>
            {commenting ? <div>bruh</div> : null}
            </Card.Footer>
        </Card>
    );
}

export default function Feed() {
  const [posts, setPosts] = useState();

  useEffect(() => {
    // Things would definitely slow down here with more posts... I would paginate the query for a real app.
    async function init() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_WORKER}/posts`
      );
      const parsedPosts = await response.json();
      parsedPosts.sort((a, b) => b.timestamp - a.timestamp);

      setPosts(parsedPosts);
    }

    init();
  }, []);

  const handleSort = (eventKey) => {
    console.log(eventKey);

    if (eventKey === "chrono") {
      const sortedPosts = [...posts];
      sortedPosts.sort((a, b) => a.timestamp - b.timestamp);
      setPosts(sortedPosts);
    } else {
      const sortedPosts = [...posts];
      sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
      setPosts(sortedPosts);
    }
  };

  return (
    <div className="feed">
      <Dropdown className="sortButton" onSelect={handleSort}>
        <Dropdown.Toggle>Sort By</Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="rchrono">Newest first</Dropdown.Item>
          <Dropdown.Item eventKey="chrono">Oldest first</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {posts
        ? posts.map((post) => (
            <Post post={post} />
          ))
        : null}
    </div>
  );
}

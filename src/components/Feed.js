import Interweave from "interweave";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "./Feed.css";
import { BsHeart, BsChat, BsHeartFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import Form from "react-bootstrap/Form";

function CommentList({ postId, refresh }) {
  const [comments, setComments] = useState([]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const requestData = {};
    for (const pair of form.entries()) {
      requestData[pair[0]] = pair[1];
    }

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_WORKER}/post/${postId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (response.status === 200) {
      event.target.reset();
      refresh();
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_WORKER}/post/${postId}/comments`
      );

      const data = await response.json();
      setComments(JSON.parse(data));
    };

    getComments();
  }, [postId]);

  return (
    <div>
      {comments?.map((comment) => (
        <div className="comment">
          <h3 className="commentTitle">{`${comment.username} on ${new Date(
            comment.timestamp
          ).toLocaleDateString()}`}</h3>
          <p className="commentBody">{comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmitComment}>
        <Form.Group>
          <Form.Label className="whiteLabel">Username</Form.Label>
          <Form.Control
            name="username"
            className="darkInput"
            type="text"
            required
          />
          <Form.Label className="whiteLabel">Comment</Form.Label>
          <Form.Control
            name="content"
            className="darkInput"
            type="text"
            required
          />
          <Form.Control className="btn-primary submitButton" type="submit" />
        </Form.Group>
      </form>
    </div>
  );
}

function Post({ post, refresh }) {
  const [commenting, setCommenting] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    // Normally whether you have liked something would be linked to your account, or I could have even stored it in localstorage. Here I'll just let people refresh and like things again, because why limit how much love one of these posts can get? :)
    const patchData = {
      likes: post.likes ? post.likes + 1 : 1,
    };

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_WORKER}/post/${post.postId}`,
      {
        method: "POST", // Would normally use PATCH, but just avoiding preflight requests for the sake of time
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(patchData),
      }
    );

    if (response.status === 200) {
      setLiked(true);
      refresh();
    }
  };

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
          <button disabled={liked} onClick={() => handleLike()}>
            {liked ? <BsHeartFill color="white" /> : <BsHeart color="white" />}

            <span>{post.likes}</span>
          </button>
          <button onClick={() => setCommenting(!commenting)}>
            <BsChat color="white" />
            <span>{post.comments}</span>
          </button>
        </div>
        {commenting ? (
          <CommentList postId={post.postId} refresh={refresh} />
        ) : null}
      </Card.Footer>
    </Card>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    setLoading(true);
    // Things would definitely slow down here with more posts... I would paginate the query for a real app.

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_WORKER}/posts`
    );

    if (response.status === 200) {
      const parsedPosts = await response.json();
      parsedPosts.sort((a, b) => b.timestamp - a.timestamp);
      setPosts(parsedPosts);
    }

    setLoading(false); // Maybe make another toast message here.
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleSort = (eventKey) => {
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
      <Button
        className="refreshButton"
        onClick={() => {
          getPosts();
        }}
      >
        {" "}
        <IoMdRefresh
          size="2em"
          className={`${loading ? "spin" : ""}`}
          color="white"
        />{" "}
      </Button>
      {posts
        ? posts.map((post) => (
            <Post key={post.postId} post={post} refresh={getPosts} />
          ))
        : null}
    </div>
  );
}

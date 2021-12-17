import { Button, Form, Modal } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
import { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import "./Create.css";

export default function Create() {
  const [creating, setCreating] = useState();
  const [title, setTitle] = useState();
  const [username, setUsername] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleSubmit = async () => {
    const post = {
      title,
      username,
      content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_WORKER}/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(post),
      }
    );

    if (response.status === 201) {
      setCreating(false);
    } else {
    }
  };

  return (
    <div>
      <Modal dialogClassName="createModal" show={creating}>
        <Modal.Header>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Form.Label>Body</Form.Label>
            <Editor
              editorState={editorState}
              wrapperClassName="editorWrapper"
              editorClassName="editor"
              onEditorStateChange={handleEditorChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setCreating(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>
      <Button
        className="createButton"
        size="lg"
        onClick={() => {
          setCreating(true);
        }}
      >
        <BsPlusLg />
      </Button>
    </div>
  );
}

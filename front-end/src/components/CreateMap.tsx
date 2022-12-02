import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


interface CreateMapProps {
  handleClose: () => void;
  show: boolean;
}

const CreateMap = (props: CreateMapProps) => {
  return (
    <>
    <Modal show={props.show} onHide={props.handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Map</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>

          <Form.Group className="mb-3" controlId="createForm.ControlInput1">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type='title'
              name='title'
              autoFocus
              placeholder="Best Dog Parks..."

              required
            />
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="createForm.ControlInput2"
          >
            <Form.Label>Location:</Form.Label>
            <Form.Control
              required
              as='select'
            >
              <option value="Choose a province">Choose a province</option>
              <option value="Alberta">Alberta</option>
              <option value="Ontario">Ontario</option>
            </Form.Control>
              
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>

        <Button>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  );
}
 
export default CreateMap;
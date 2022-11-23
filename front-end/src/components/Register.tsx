import React, { useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

interface RegisterProps {
  handleClose: () => void;
  show: boolean
}

const Register = (props: RegisterProps) => {
  const usernameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const passwordConfirmationInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="registerForm.ControlInput1">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type='username'
                name='username'
                autoFocus
                ref={usernameInput}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerForm.ControlInput2">
              <Form.Label>Email address:</Form.Label>
              <Form.Control
                type='email'
                name='email'
                placeholder="name@example.com"
                ref={emailInput}
                required
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="registerForm.ControlPassword1"
            >
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type='password'
                name='password'
                ref={passwordInput}
                required
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="registerForm.ControlPassword2"
            >
              <Form.Label>Password confirmation:</Form.Label>
              <Form.Control
                type='password'
                name='password'
                ref={passwordConfirmationInput}
                required
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>

          <Button id='register'>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
 
export default Register;
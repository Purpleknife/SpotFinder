import React, { useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

interface LoginProps {
  handleClose: () => void;
  show: boolean;
}

const Login = (props: LoginProps) => {

  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3" controlId="loginForm.ControlInput1">
              <Form.Label>Email address:</Form.Label>
              <Form.Control
                type="email"
                name='email'
                autoFocus
                placeholder="name@example.com"
                ref={emailInput}
                required
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="loginForm.ControlPassword1"
            >
              <Form.Label>Password:</Form.Label>
              <Form.Control
                data-testid='password'
                type="password"
                name='password'
                ref={passwordInput}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>

          <Button id='login'>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
 
export default Login;
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

interface CreateMapProps {
  handleClose: () => void;
  show: boolean;
  coordinates: any[];
}

const CreateMap = (props: CreateMapProps) => {
  const navigate = useNavigate();
  
  const [coordinatesList, setCoordinatesList] = useState<any>(null);
  
  interface Coordinates {
    id: number;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
    
  };


  const generateCoordinatesList = () => {
    const coorList = props.coordinates.map((coor: Coordinates) => {
      return (
        <option key={coor.id} value={coor.city}>{coor.city}, {coor.province}, {coor.country}</option>
      )
    });
    setCoordinatesList(coorList);
  };

  useEffect(() => {
    if (props.coordinates) {
      generateCoordinatesList();
    }
  }, [props.coordinates]);


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
              placeholder="Best Dog Parks, Best Restaurants in Town..."

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
              {coordinatesList}
            </Form.Control>
              
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>

        <Button >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  );
}
 
export default CreateMap;
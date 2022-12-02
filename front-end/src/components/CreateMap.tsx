import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import LocationList from './LocationList';


interface CreateMapProps {
  handleClose: () => void;
  show: boolean;
}

const CreateMap = (props: CreateMapProps) => {
  const [coordinates, setCoordinates] = useState<any>(null);
  const [coordinatesList, setCoordinatesList] = useState<any>(null);

  const getCoordinates = async() => {
    return axios.get('/coordinates')
      .then((res) => {
        console.log('coordinates', res.data);
        setCoordinates(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  interface Coordinates {
    id: number;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
  };


  const generateCoordinatesList = () => {
    const coorList = coordinates.map((coor: Coordinates) => {
      return (
        <LocationList
          key={coor.id}
          id={coor.id}
          city={coor.city}
          province={coor.province}
          country={coor.country}
          latitude={coor.latitude}
          longitude={coor.longitude}

        />
      )
    });
    setCoordinatesList(coorList);
  };

  useEffect(() => {
    if (coordinates) {
      generateCoordinatesList();
    }
  }, [coordinates]);


  useEffect(() => {
    getCoordinates();
  }, []);

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
              {coordinatesList}
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
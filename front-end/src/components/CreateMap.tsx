import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useCookies } from 'react-cookie';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

interface CreateMapProps {
  handleClose: () => void;
  refetch: () => void;
  show: boolean;
  coordinates: any[];
}

const CreateMap = (props: CreateMapProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = cookies.user_id;

  const navigate = useNavigate();

  const [locationInput, setLocationInput] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  const [coordinatesList, setCoordinatesList] = useState<any>(null);

  interface Coordinates {
    id: number;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
    
  };


  const generateLocationList = () => {
    const coorList = props.coordinates.map((coor: Coordinates) => {
      return (
        <option key={coor.id} value={coor.latitude +', '+ coor.longitude +', '+ coor.city +', '+ coor.province+', '+ coor.country}>
          {coor.city}, {coor.province}, {coor.country}
        </option>
      )
    });
    setCoordinatesList(coorList);
  };


  const createMap = async() => {
    const data = locationInput.split(', ');
    const latitude = data[0];
    const longitude = data[1];
    const city = data[2];
    const province = data[3];
    const country = data[4];


    return axios.post(`/maps/${user_id}`, {
      creator: user_id,
      title: titleInput,
      city: city,
      province: province,
      country: country,
      latitude: latitude,
      longitude: longitude
    })
      .then((res) => {
        //console.log('data we got back', res.data);
        props.refetch(); // => Load all the maps + the new one in the Landing Page.
        navigate(`/maps/${res.data[0].map_id}`, 
          { state: {
              id: res.data[0].map_id, 
              key: res.data[0].map_id,
              title: titleInput,
              date_created: res.data[0].date_contributed,
              latitude: latitude,
              longitude: longitude,
              allPins: []
            }
          }
        );
        props.handleClose();
        
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    if (props.coordinates) {
      generateLocationList();
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
              onChange = {(event) => {
                setTitleInput(event.target.value)}
              }
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
              onChange = {(event) => {
                setLocationInput(event.target.value)}
              }
              >
              
              <option value="Choose a province">Choose a province</option>
              {coordinatesList}
            </Form.Control>
              
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>

        <Button onClick={createMap}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  );
}
 
export default CreateMap;
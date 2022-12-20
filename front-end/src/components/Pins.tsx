import React, { useState, useEffect } from 'react';

import { Marker, Popup } from 'react-leaflet';

import { useCookies } from 'react-cookie';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import './Pins.scss';

import axios from 'axios';

import PinLikes from './PinLikes';

interface PinProps {
  id: number | string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  image: string;
  refetch: () => void;
  map_id: number;
}


const Pins = (props: PinProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked', 'pinLiked']);
  const user_id = cookies.user_id;

  const [showLikes, setShowLikes] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [pinLikes, setPinLikes] = useState<any>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  const handleLikeClose = () => setShowLikes(false);
  const handleLikeShow = () => setShowLikes(true);

  const handleCommentClose = () => setShowComments(false);
  const handleCommentShow = () => setShowComments(true);

  const [color, setColor] = useState<string>('#000000');

  const icon = L.icon({ 
    iconUrl: "/images/marker-icon.png",
    iconSize: [26, 36], // Icon size.
    iconAnchor: [16,32], // Where the popup points.
    popupAnchor:  [0, 0]
  });

  // Load the likes of a pin:
  const loadLikes = async() => {
    return axios.get(`/pins/${props.id}/likes`)
      .then((res) => {
        console.log('pin likes', res.data);
        setTotalLikes(res.data.length);
        setPinLikes(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  // Check if a user already liked a pin:
  const checkIfPinLikedByUser = (id: number) => {
    for (const like in pinLikes) {
      if (pinLikes[like].user_id === Number(id)) { //=> Had to convert to Number because the user_id from cookies is a string.
        return true;
      }
    }
    return false;
  };


  // Add or remove a like depending on checkIfPinLikedByUser:
  const addOrRemoveLike = async() => {    
    if (checkIfPinLikedByUser(user_id)) {
      return axios.delete(`/pins/${props.id}/likes/${user_id}`)
        .then((res) => {
          setCookie('pinLiked', 'no', {path: `/maps/${props.map_id}`});
          loadLikes();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    if (!checkIfPinLikedByUser(user_id)) {
      return axios.post(`/pins/${props.id}/likes`, {
        user_id: user_id
      })
        .then((res) => {
          setCookie('pinLiked', 'yes', {path: `/maps/${props.map_id}`});
          loadLikes();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  useEffect(() => {
    loadLikes();    
  }, []);


  // To change the color of the like button to red if the user already liked the map.
  useEffect(() => {
    if (cookies.pinLiked === 'yes') {
      setColor('#FF0000');
    }
    if (cookies.pinLiked === 'no') {
      setColor('#000000');
    }
  }, [cookies.pinLiked])



  interface PinLike {
    date_liked: string;
    first_name: string;
    id: number;
    last_name: string;
    map_id: number;
    profile_image: string;
    user_id: number;
    username: string;
  };



  // Get a list of the users who liked a specific pin:
  const likesList = pinLikes?.map((like: PinLike) => {
    return (
      <PinLikes
        key={like.id}
        id={like.id}
        like_creator={like.user_id}
        date_liked={like.date_liked}
        first_name={like.first_name}
        last_name={like.last_name}
        map_id={like.map_id}
        profile_image={like.profile_image}
        username={like.username}
      />
    )
  });


  return (
    <>
      <Marker position={[props.latitude, props.longitude]} icon={icon}>
        <Popup>
          {props.title} <br />
          <img
            className='pin_img'
            alt='pin_img'
            src={props.image}
          /><br />
          {props.description}

          <div className='pin_likes'>
            <i 
              className="fa-solid fa-heart"
              onClick={addOrRemoveLike}
              style={ {color: `${color}`} }
            ></i>
            <Button onClick={handleLikeShow}> {totalLikes} Likes</Button>&nbsp;&nbsp;
            <Button onClick={handleCommentShow}>Comments</Button>

            <Modal show={showLikes} onHide={handleLikeClose}>
              <Modal.Header closeButton>
                <Modal.Title> Likes</Modal.Title>
              </Modal.Header>
              <Modal.Body>{likesList}</Modal.Body>
            </Modal>

            <Modal show={showComments} onHide={handleCommentClose}>
              <Modal.Header closeButton>
                <Modal.Title> Comments</Modal.Title>
              </Modal.Header>
              <Modal.Body>test1</Modal.Body>
            </Modal>
          </div>

        </Popup>
        
      </Marker>
      

    </>

  );
}
 
export default Pins;
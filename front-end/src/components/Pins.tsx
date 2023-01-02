import React, { useState, useEffect, useRef } from 'react';

import { Marker, Popup } from 'react-leaflet';

import { useCookies } from 'react-cookie';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import './Pins.scss';

import axios from 'axios';

import PinsLikes from './PinsLikes';
import PinComments from './PinComments';
import { EditState } from './Map';


interface PinProps {
  id: number | string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  image: string;
  refetch: () => void;
  map_id: number;
  creator: number;
  uploadImage: () => void;
  pinImage: string;
};

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


interface PinComment {
  content: string;
  date_commented: string;
  first_name: string;
  id: number;
  last_name: string;
  map_id: number;
  profile_image: string;
  user_id: number;
  username: string;
};


const Pins = (props: PinProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked', 'pinLiked']);
  const user_id = Number(cookies.user_id);

  const [showLikes, setShowLikes] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [pinLikes, setPinLikes] = useState<any>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  const [pinComments, setPinComments] = useState<any>(null);
  const [totalComments, setTotalComments] = useState<number>(0);

  const commentInput = useRef<HTMLInputElement>(null);

  const handleLikeClose = () => setShowLikes(false);
  const handleLikeShow = () => setShowLikes(true);

  const handleCommentClose = () => setShowComments(false);
  const handleCommentShow = () => setShowComments(true);

  const [color, setColor] = useState<string>('#000000');

  const [profileImg, setProfileImg] = useState<string>('');

  const [inputTitle, setInputTitle] = useState<string>(props.title);
  const [inputDescription, setInputDescription] = useState<string>(props.description);

  const [editInput, setEditInput] = useState<EditState>({
    editing: false,
    viewMode: {
      display: ''
    },
    editMode: {
      display: ''
    }
  });


  const icon = L.icon({ 
    iconUrl: "/images/marker-icon.png",
    iconSize: [26, 36], // Icon size.
    iconAnchor: [16,32], // Where the popup points.
    popupAnchor:  [0, 0]
  });



  // When the user clicks on edit:
  const edit = () => {
    setEditInput(prev => {
      return {
        ...prev, 
        editing: true
      }
    });

  };


  // To show or hide the input field (for editing):
  useEffect(() => {
    if (editInput.editing) {
      setEditInput(prev => {
        return {
          ...prev, 
          viewMode: {
            display: 'none'
          },
          editMode: {
            display: ''
          }
        }
      });
    } else {
      setEditInput(prev => {
        return {
          ...prev,
          viewMode: {
            display: ''
          },
          editMode: {
            display: 'none'
          }
        }
      });
    };
  }, [editInput.editing])


  // When the user clicks on save:
  const editIt = () => {
    setEditInput(prev => {
      return {
        ...prev, 
        editing: false
      }
    });

    editPin();
  };


  //To edit a pin => title, description and image:
  const editPin = async() => {
    return axios.put(`/pins/${props.id}/${user_id}`, { 
      title: inputTitle,
      description: inputDescription,
      ...(props.pinImage && { image: props.pinImage })
    })
      .then((res) => {
        console.log('edit pin', res.data);
        props.refetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };



  // Load the likes of a pin:
  const loadLikes = async() => {
    return axios.get(`/pins/${props.id}/likes`)
      .then((res) => {
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


  // To change the color of the like button to red if the user already liked the map.
  useEffect(() => {
    if (cookies.pinLiked === 'yes') {
      setColor('#FF0000');
    }
    if (cookies.pinLiked === 'no') {
      setColor('#000000');
    }
  }, [cookies.pinLiked])


  // Get a list of the users who liked a specific pin:
  const likesList = pinLikes?.map((like: PinLike) => {
    return (
      <PinsLikes
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


  // Load the comments of a pin:
  const loadComments = async() => {
    return axios.get(`/pins/${props.id}/comments`)
      .then((res) => {
        setPinComments(res.data);
        setTotalComments(res.data.length);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  // Add a comment to a pin:
  const addMapComment = async() => {
    return axios.post(`/pins/${props.id}/comments`, {
      content: commentInput.current!.value,
      user_id: user_id,
    })
    .then((res) => {
      commentInput.current!.value = '';
      loadComments();
    })
    .catch((error) => {
      console.log(error.message);
    });
  };


  // Get a list of the comments in a specific pin:
  const commentsList = pinComments?.map((comment: PinComment) => {
    return (
      <PinComments
        key={comment.id}
        id={comment.id}
        comment_creator={comment.user_id}
        content={comment.content}
        date_commented={comment.date_commented}
        first_name={comment.first_name}
        last_name={comment.last_name}
        map_id={comment.map_id}
        profile_image={comment.profile_image}
        username={comment.username}
        refetch={loadComments}
      />
    )
  });


  // The user can delete their own pins:
  const deletePin = async() => {
    return axios.delete(`/pins/${props.id}/${user_id}`)
      .then((res) => {
        console.log('Pin deleted.');
        props.refetch();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  // Load user's profile_image:
  const loadProfileImage = async() => {
    return axios.get(`/user_image/${user_id}`)
      .then((res) => {
        setProfileImg(res.data.profile_image);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  useEffect(() => {
    loadLikes();
    loadComments();
    loadProfileImage();
  }, []);




  return (
    <div className='pin_popup'>
      
      <Marker position={[props.latitude, props.longitude]} icon={icon}>
        <Popup>

        { props.creator === user_id && 
            <div className='pin_btns'>
              <button id='delete' onClick={deletePin}><i className="fa-solid fa-trash"></i></button>
              <button id='edit' style={editInput.viewMode} onClick={edit} ><i className="fa-solid fa-pen-to-square"></i></button>
              <button id='save_pin' style={editInput.editMode} className="save" onClick={editIt}><i className="fa-solid fa-floppy-disk"></i></button>
            </div>
          }

          <div className='pin_info'>
            {/* Title */}
            <span id='title' style={editInput.viewMode}><i className="fa-solid fa-map-pin"></i> {inputTitle ? inputTitle : props.title}</span>
            <input 
              className="input-field-title"
              type="text"
              style={editInput.editMode}
              placeholder={props.title}
              value={inputTitle}
              onChange = {(event) => {
                setInputTitle(event.target.value)}
              }
            />
            
            

            {/* Image */}
            <img
              className='pin_img'
              style={editInput.viewMode}
              alt='pin_img'
              src={props.image}
            />

            <input 
              type='file'
              style={editInput.editMode}
              className="uploadInput"
            />
            <button id='load_btn' style={editInput.editMode} onClick={() => props.uploadImage()}>Load</button>
            
            
            

            {/* Description */}
            <span id='description' style={editInput.viewMode}>{inputDescription ? inputDescription : props.description}</span>
            <textarea 
              className="input-field-desc"
              style={editInput.editMode}
              placeholder={props.description}
              value={inputDescription}
              onChange = {(event) => {
                setInputDescription(event.target.value)}
              }
            />
          </div>

          <div className='pin_likes_comments'>
            <i 
              className="fa-solid fa-heart"
              onClick={addOrRemoveLike}
              style={ {color: `${color}`} }
            ></i>
            <Button id='pin_like' onClick={handleLikeShow}>{totalLikes}</Button>
            <Button id='pin_comment' onClick={handleCommentShow}><i className="fa-solid fa-comment"></i> {totalComments}</Button>

            <Modal show={showLikes} onHide={handleLikeClose}>
              <Modal.Header closeButton>
                <Modal.Title> {totalLikes} Likes</Modal.Title>
              </Modal.Header>
              <Modal.Body>{likesList}</Modal.Body>
            </Modal>

            <Modal show={showComments} onHide={handleCommentClose}>
              <Modal.Header closeButton>
                <Modal.Title> {totalComments} Comments</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <img
                  className='comment_pin_img'
                  alt='comment_pin_img'
                  src={profileImg}
                />

                <input
                  className='input_comment_pin'
                  type='text'
                  name='comment'
                  placeholder='Write a comment here...'
                  ref={commentInput}
                />

                <button className='add_comment_pin' onClick={addMapComment}>Add</button>
                <br />

                {commentsList}

              </Modal.Body>
            </Modal>
          </div>

        </Popup>
        
      </Marker>
      

    </div>

  );
}
 
export default Pins;
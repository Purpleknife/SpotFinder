import { useEffect, useState, useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { useCookies } from 'react-cookie';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import axios from 'axios';

import MapView from './MapView';
import MapComments from './MapComments';
import MapLikes from './MapLikes';

const MapPage = () => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = cookies.user_id;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [mapComments, setMapComments] = useState<any>(null);
  const [allMapComments, setAllMapComments] = useState<any>(null);
  const [totalComments, setTotalComments] = useState<number>(0);

  const [mapLikes, setMapLikes] = useState<any>(null);
  const [allMapLikes, setAllMapLikes] = useState<any>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  const location = useLocation();

  const commentInput = useRef<HTMLInputElement>(null);

  // Load the comments of a map:
  const loadComments = async() => {
    return axios.get(`/maps/${location.state.id}/comments`)
      .then((res) => {
        setMapComments(res.data);
        setTotalComments(res.data.length);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  // Add a comment to a map:
  const addMapComment = async() => {
    return axios.post(`/maps/${location.state.id}/comments`, {
      content: commentInput.current!.value,
      user_id: user_id,
    })
    .then((res) => {
      console.log('addComment', res.data);
      commentInput.current!.value = '';
      loadComments();
    })
    .catch((error) => {
      console.log(error.message);
    });
  };


  // Load the likes of a map:
  const loadLikes = async() => {
    return axios.get(`/maps/${location.state.id}/likes`)
    .then((res) => {
      console.log('likes', res.data);
      setTotalLikes(res.data.length);
      setMapLikes(res.data);
    })
    .catch((error) => {
      console.log(error.message);
    });
  };

  interface Like {
    date_liked: string;
    first_name: string;
    id: number;
    last_name: string;
    map_id: number;
    profile_image: string;
    user_id: number;
    username: string;
  };


  const generateMapLikes = () => {
    const likesList = mapLikes.map((like: Like) => {
      return (
        <MapLikes
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
    setAllMapLikes(likesList);
  };



  interface Comment {
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

  const generateMapComments = () => {
    const commentsList = mapComments.map((comment: Comment) => {
      return (
        <MapComments
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
        />
      )
    });
    setAllMapComments(commentsList);

  };

  useEffect(() => {
    if (mapComments) {
      generateMapComments();
    }
  }, [mapComments]);

  useEffect(() => {
    if (mapLikes) {
      generateMapLikes();
    }
  }, [mapLikes]);

  useEffect(() => {
    loadComments();
    loadLikes();
  }, []);


  return (
    <div className='map_page'>
      <MapView 
        key={location.state.key}
        id={location.state.id}
        latitude={location.state.latitude}
        longitude={location.state.longitude}
        allPins={location.state.allPins} 
      />
      {totalComments} Comments 
      {totalLikes} <Button onClick={handleShow}>Likes</Button>

      <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{totalLikes} Likes</Modal.Title>
        </Modal.Header>
        <Modal.Body>{allMapLikes}</Modal.Body>
      </Modal>
      </div>
      <br />

      <input 
        type='text'
        name='comment'
        placeholder='Write a comment here...'
        ref={commentInput}
      />

      <button onClick={addMapComment}>Add</button>

      <br />
      {allMapComments}

    </div>
  );
}
 
export default MapPage;
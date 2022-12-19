import { useEffect, useState, useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { useCookies } from 'react-cookie';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import axios from 'axios';

import MapView from './MapView';
import MapComments from './MapComments';
import MapLikes from './MapLikes';

interface MapPageProps {
  mapData: any[];
  refetch: () => void;
}

const MapPage = (props: MapPageProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked']);
  const user_id = cookies.user_id;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  interface SpecificMap {
    id: number;
    title: string;
    date_created: string;
    city: string;
    country: string;
    province: string;
    username: string;
    creator: number;
    latitude: number;
    longitude: number;
    pins: any[];
  }


  const [specificMap, setSpecificMap] = useState<SpecificMap | null>();

  const [mapComments, setMapComments] = useState<any>(null);
  const [allMapComments, setAllMapComments] = useState<any>(null);
  const [totalComments, setTotalComments] = useState<number>(0);

  const [mapLikes, setMapLikes] = useState<any>(null);
  const [allMapLikes, setAllMapLikes] = useState<any>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [color, setColor] = useState('#000000');

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
      setTotalLikes(res.data.length);
      setMapLikes(res.data);
    })
    .catch((error) => {
      console.log(error.message);
    });
  };


  // Check if a user already liked a map:
  const checkIfMapLikedByUser = (id: number) => {
    for (const like in mapLikes) {
      if (mapLikes[like].user_id === Number(id)) { //=> Had to convert to Number because the user_id from cookies is a string.
        return true;
      }
    }
    return false;
  };


  // Add or remove a like depending on checkIfMapLikedByUser:
  const addOrRemoveLike = async() => {    
    if (checkIfMapLikedByUser(user_id)) {
      return axios.delete(`/maps/${location.state.id}/likes/${user_id}`)
        .then((res) => {
          setCookie('alreadyLiked', 'no', {path: `/maps/${location.state.id}`});
          loadLikes();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    if (!checkIfMapLikedByUser(user_id)) {
      return axios.post(`/maps/${location.state.id}/likes`, {
        user_id: user_id
      })
        .then((res) => {
          setCookie('alreadyLiked', 'yes', {path: `/maps/${location.state.id}`});
          loadLikes();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
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
    loadSpecificMap();
  }, []);


  // To change the color of the like button to red if the user already liked the map.
  useEffect(() => {
    if (cookies.alreadyLiked === 'yes') {
      setColor('#FF0000');
    }
    if (cookies.alreadyLiked === 'no') {
      setColor('#000000');
    }
  }, [cookies.alreadyLiked])


  const loadSpecificMap = async() => {
    return axios.get(`/maps/${location.state.id}`)
    .then((res) => {
      console.log('MAP VIEW HERE', res.data[0].title);
      setSpecificMap({
        id: res.data[0].id,
        title: res.data[0].title,
        date_created: res.data[0].date_created,
        city: res.data[0].city,
        country: res.data[0].country,
        province: res.data[0].province,
        username: res.data[0].username,
        creator: res.data[0].creator,
        latitude: res.data[0].latitude,
        longitude: res.data[0].longitude,
        pins: res.data[0].pins
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  //console.log('specific map', specificMap)

  return (
    <div className='map_page'>
      
      { specificMap && 
      <>
      Title: {specificMap.title} <br />
      Created on: {specificMap.date_created}

      <MapView
        key={specificMap.id}
        id={specificMap.id}
        title={specificMap.title}
        date_created={specificMap.date_created}
        latitude={specificMap.latitude}
        longitude={specificMap.longitude}
        allPins={specificMap.pins}
        refetch={props.refetch}
      />
      {specificMap.pins.length} pins in total
      </>
      }
      
      <i 
        className="fa-solid fa-heart"
        onClick={addOrRemoveLike}
        style={ {color: `${color}`} }
      ></i> <Button onClick={handleShow}>{totalLikes}</Button>&nbsp;&nbsp;
      {totalComments} <i className="fa-solid fa-comment"></i>

      <div className='all_likes'>
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
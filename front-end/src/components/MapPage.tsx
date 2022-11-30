import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { useCookies } from 'react-cookie';

import axios from 'axios';

import MapView from './MapView';
import MapComments from './MapComments';

const MapPage = () => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = cookies.user_id;

  const [mapComments, setMapComments] = useState<any>(null);
  const [allMapComments, setAllMapComments] = useState<any>(null);

  const location = useLocation();

  console.log('location', location.state)

  const loadComments = async() => {
    return axios.get(`/maps/${location.state.id}/comments`)
      .then((res) => {
        console.log('comments', res.data);
        setMapComments(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
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
    loadComments();
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

      {allMapComments}

    </div>
  );
}
 
export default MapPage;
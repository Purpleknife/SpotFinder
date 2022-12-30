import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useCookies } from 'react-cookie';

import axios from 'axios';

import './Buttons.scss';

interface ButtonsProps {
  map_id: number;
  refetch: () => void;
  creator: number;
};


const Buttons = (props: ButtonsProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked', 'pinLiked']);
  const user_id = Number(cookies.user_id);

  const navigate = useNavigate();

  // A user can delete their own maps:
  const deleteMap = async() =>{
    return axios.delete(`/maps/${props.map_id}/${user_id}`)
      .then((res) => {
        console.log('Map deleted.');
        props.refetch();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className='buttons'>

      <button className='view' type='submit' onClick={() => navigate(`/maps/${props.map_id}`, 
          { state: {
              id: props.map_id }
          }
        )}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <span className="tooltiptext">View</span>
      </button>


      { props.creator === user_id && 
        <button className='delete' type='submit' onClick={deleteMap} >
          <i className="fa-solid fa-trash"></i>
          <span className="tooltiptext">Delete</span>
        </button>
      }
    </div>
  );
}
 
export default Buttons;
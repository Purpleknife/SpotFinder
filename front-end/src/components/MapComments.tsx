import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { useCookies } from 'react-cookie';
import { EditState } from './Map';

import './MapComments.scss';

import moment from "moment";

interface MapCommentsProps {
  content: string;
  date_commented: string;
  first_name: string;
  id: number;
  last_name: string;
  map_id: number;
  profile_image: string;
  comment_creator: number;
  username: string;
  refetch: () => void;
};


const MapComments = (props: MapCommentsProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked', 'pinLiked']);
  const user_id = Number(cookies.user_id);

  const navigate = useNavigate();

  const [editInput, setEditInput] = useState<EditState>({
    editing: false,
    viewMode: {
      display: ''
    },
    editMode: {
      display: ''
    }
  });

  const [inputContent, setInputContent] = useState<string>(props.content);


  // When the user clicks on edit:
  const edit = () => {
    setEditInput(prev => {
      return {
        ...prev, 
        editing: true
      }
    });

  };


  // To show or hide the input field:
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

    editComment();
  };


  //To edit a map's comment:
  const editComment = async() => {
    return axios.put(`/maps/comments/${props.id}/${user_id}`, { 
      content: inputContent
    })
      .then((res) => {
        props.refetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  // Delete a comment:
  const deleteComment = async() => {
    return axios.delete(`/maps/${props.map_id}/${props.id}/${user_id}`)
      .then((res) => {
        props.refetch();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // Navigate to profile:
  const navigateToProfile = () => {
    navigate(`/profile/${props.comment_creator}`)
  };


  return (
    <div className='comments'>
    
        <img
          alt='comment_img'
          src={props.profile_image}
          onClick={navigateToProfile}
        />
  
        <div className='inner_comment'>
          <div className='content'>
            <div className='inner_content'>
              <span className='username' onClick={navigateToProfile}>{props.username}</span>
              <span className='text' style={editInput.viewMode}>{inputContent ? inputContent : props.content}</span>
                <input 
                  className="input-field-map"
                  type="text"
                  style={editInput.editMode}
                  placeholder={props.content}
                  value={inputContent}
                  onChange = {(event) => {
                    setInputContent(event.target.value)}
                  }
                />
              </div>
            </div>

        
        <div className='info'>
          <span className='date'>{moment(new Date(props.date_commented)).fromNow()}</span>

          { props.comment_creator === user_id && 
            <>
              <button onClick={deleteComment}><i className="fa-solid fa-trash"></i></button>
              <button style={editInput.viewMode} onClick={edit}><i className="fa-solid fa-pen-to-square"></i></button>
              <button style={editInput.editMode} onClick={editIt}><i className="fa-solid fa-floppy-disk"></i></button>
            </>
          }
        </div>
        </div>
      
    </div>
  );
}
 
export default MapComments;
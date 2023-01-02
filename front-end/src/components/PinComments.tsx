import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { useCookies } from 'react-cookie';

import { EditState } from './Map';

import './PinComments.scss';

import moment from 'moment';

interface PinCommentsProps {
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


const PinComments = (props: PinCommentsProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in', 'alreadyLiked', 'pinLiked']);
  const user_id = Number(cookies.user_id);

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


  //To edit a pin's comment:
  const editComment = async() => {
    return axios.put(`/pins/comments/${props.id}/${user_id}`, { 
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
  const deletePinComment = async() => {
    return axios.delete(`/pins/${user_id}/${props.id}/${props.map_id}`)
      .then((res) => {
        props.refetch();
        console.log('delete');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };



  return (
    <div className='pin_comments'>

      <img
        alt='img'
        src={props.profile_image}

      />

    <div className='inner_pin_comment'>
      <div className='content_pin'>
      <div className='info'>
      <span className='date'>{moment(props.date_commented).startOf('day').fromNow()}</span>
        
        { props.comment_creator === user_id && 
          <>
            <button onClick={deletePinComment}><i className="fa-solid fa-trash"></i></button>
            <button style={editInput.viewMode} onClick={edit}><i className="fa-solid fa-pen-to-square"></i></button>
            <button style={editInput.editMode} onClick={editIt}><i className="fa-solid fa-floppy-disk"></i></button>
          </>
        }
      </div>
      
        <div className='inner_content_pin'>
        <span className='username'>{props.username}</span>
          
          <span className='text' style={editInput.viewMode}>{inputContent ? inputContent : props.content}</span>
            <textarea 
              className="input_content_pin"
              
              style={editInput.editMode}
              placeholder={props.content}
              value={inputContent}
              onChange = {(event) => {
                setInputContent(event.target.value)}
              }
            />
        </div>
      </div>

      

    </div>
    </div>
  );
}
 
export default PinComments;
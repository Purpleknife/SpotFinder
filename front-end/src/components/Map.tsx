import React, { useEffect, useState } from 'react';

import './Map.scss';

import 'leaflet/dist/leaflet.css';

import MapView from './MapView';
import Buttons from './Buttons';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { useCookies } from 'react-cookie';

interface MapProps {
  id: number;
  creator: number;
  username: string;
  date_created: string;
  title: string;
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  pins: any[];
  refetch: () => void;
};

export interface ViewOrEdit {
  display: string;
};

export interface EditState {
  editing: boolean;
  viewMode: ViewOrEdit;
  editMode: ViewOrEdit;
};



const Map = (props: MapProps) => {
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

  const [inputTitle, setInputTitle] = useState<string>(props.title);


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

    editMap();
  };

  // Change the contribution type that shows up in the profile:
  const changeContributionType = async() => {
    return axios.put(`/maps/contribution_type/${user_id}/${props.id}`, {
      contribution_type: 'Edited Map'
    })
      .then((res) => {
        console.log('contributions type', res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  //To edit a map's title:
  const editMap = async() => {
    return axios.put(`/maps/${props.id}/${user_id}`, { 
      title: inputTitle
    })
      .then((res) => {
        props.refetch();
        changeContributionType();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className='map'>
      
      <div className='map_btns'>
        <Buttons map_id={props.id} refetch={props.refetch} creator={props.creator} />
        
        <div className="edit">
          { props.creator === user_id && 
            <span style={editInput.viewMode} onClick={edit}><i className="fa-solid fa-pen-to-square"></i></span>
          }
            <span style={editInput.editMode} className="save" onClick={editIt}><i className="fa-solid fa-floppy-disk"></i></span>
        </div>
      </div>
      
      <div className='map_info'>
        <i className="fa-sharp fa-solid fa-thumbtack"></i>
        
        <span id='title' style={editInput.viewMode}> {inputTitle ? inputTitle : props.title}</span>
          <input 
            className="input-field-map"
            type="text"
            style={editInput.editMode}
            placeholder={props.title}
            value={inputTitle}
            onChange = {(event) => {
              setInputTitle(event.target.value)}
            }
          />
          

        <br />
        <i className="fa-solid fa-location-dot"></i> {props.city}, {props.province}, {props.country}
      
      </div>

      <MapView refetch={props.refetch} id={props.id} key={props.id} title={props.title} date_created={props.date_created} latitude={props.latitude} longitude={props.longitude} allPins={props.pins}/>

      <div className='created_by'><i className="fa-solid fa-user-secret"></i> <span id='created'>Created by</span>
        <span id='username' onClick={() => navigate(`/profile/${props.creator}`)}> {props.username}</span>, on {props.date_created}.
      </div>

      

    </div>
  );
}
 
export default Map;


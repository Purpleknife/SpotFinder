import React, { useState, useEffect } from 'react';

import { useCookies } from 'react-cookie';

import { EditState } from './Map';

import axios from 'axios';

interface ProfileInfoProps {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
  profile_image: string;
  province: string;
  username: string;
  city: string;
  country: string;
  email: string;  
  totalContributions: number;
  totalFavorites: number;
  showFav: () => void;
  showContri: () => void;
};

const ProfileInfo = (props: ProfileInfoProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = Number(cookies.user_id);

  const [profileImage, setProfileImage] = useState<string>(props.profile_image);

  const [inputUsername, setInputUsername] = useState<string>(props.username);
  const [inputFirstName, setInputFirstName] = useState<string>(props.first_name);
  const [inputLastName, setInputLastName] = useState<string>(props.last_name);
  const [inputCity, setInputCity] = useState<string>(props.city);
  const [inputProvince, setInputProvince] = useState<string>(props.province);
  const [inputCountry, setInputCountry] = useState<string>(props.country);

  const [editInput, setEditInput] = useState<EditState>({
    editing: false,
    viewMode: {
      display: ''
    },
    editMode: {
      display: ''
    }
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

    editUserInfo();
  };


  //To edit a user's info => username, first_name, last_name, location and profile_image:
  const editUserInfo = async() => {
    return axios.put(`/users/${user_id}`, { 
      username: inputUsername,
      first_name: inputFirstName,
      last_name: inputLastName,
      city: inputCity,
      province: inputProvince,
      country: inputCountry,
      ...(profileImage && { profile_image: profileImage })
    })
      .then((res) => {
        console.log('edit user', res.data);
        //props.refetch();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  // To upload a picture when the user wants to change their profile image:
  const uploadProfileImage = async() => {
    const upload_preset: any = process.env.REACT_APP_UPLOAD_PRESET;
    const cloud_name = process.env.REACT_APP_CLOUDNAME;

    const files = document.querySelector<HTMLInputElement>(".uploadInput")!.files;
    const formData = new FormData();

    formData.append('file', files![0]);
    formData.append('upload_preset', upload_preset);
      axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      )
      .then(res => {
        setProfileImage(res.data.secure_url);
        console.log('img uploaded');
      })
      .catch(error => {
        console.log('Upload error', error);
      })
  };



  return (
    <div>

      { props.id === user_id && 
        <>
          <button style={editInput.viewMode} onClick={edit} >Edit</button>
          <button style={editInput.editMode} className="save" onClick={editIt}><i className="fa-solid fa-floppy-disk"></i>Save</button>
        </>
      }

      <br />

      {/* Image */}
      <img
            className='profile_img'
            style={editInput.viewMode}
            alt='profile_img'
            src={props.profile_image}
          />

          <input 
            type='file'
            style={editInput.editMode}
            className="uploadInput"
          />
          <button style={editInput.editMode} onClick={uploadProfileImage}>Load</button>

      <br />
      {/* Username */}
      <span style={editInput.viewMode}>Hello, {inputUsername ? inputUsername : props.username}!</span>
      <input 
        type="text"
        style={editInput.editMode}
        placeholder={props.username}
        value={inputUsername || undefined}
        onChange = {(event) => {
          setInputUsername(event.target.value)}
        }
      />

      <br />

      {/* First and Last names */}
      <span style={editInput.viewMode}>
        { inputFirstName 
        ? inputFirstName + ' ' + inputLastName
        : (props.first_name === null || props.last_name === null) ? '' : props.first_name + ' ' + props.last_name
        }
      </span>
      <input 
        type="text"
        style={editInput.editMode}
        placeholder={props.first_name ? props.first_name : 'First name'}
        value={inputFirstName || undefined}
        onChange = {(event) => {
          setInputFirstName(event.target.value)}
        }
      />

      <input 
        type="text"
        style={editInput.editMode}
        placeholder={props.last_name ? props.last_name : 'Last name'}
        value={inputLastName || undefined}
        onChange = {(event) => {
          setInputLastName(event.target.value)}
        }
      />

    <br />

      {/* City, Province and Country */}
      <span style={editInput.viewMode}>
        { inputCity || inputProvince || inputCountry
        ? inputCity + ', ' + inputProvince + ', ' + inputCountry
        : (props.city === null || props.province === null || props.country === null) ? '' : props.city + ', ' + props.province + ', ' + props.country
        }
      </span>
      <input 
        type="text"
        style={editInput.editMode}
        placeholder={props.city ? props.city : 'City'}
        value={inputCity || undefined}
        onChange = {(event) => {
          setInputCity(event.target.value)}
        }
      />

      <input 
        type="text"
        style={editInput.editMode}
        placeholder={props.province ? props.province : 'Province'}
        value={inputProvince || undefined}
        onChange = {(event) => {
          setInputProvince(event.target.value)}
        }
      />

      <input 
        type="text"
        style={editInput.editMode}
        placeholder={props.country ? props.country : 'Country'}
        value={inputCountry || undefined}
        onChange = {(event) => {
          setInputCountry(event.target.value)}
        }
      />


      <br />
      <span onClick={props.showContri}>Contributions:</span> {props.totalContributions}
      <br />
      <span onClick={props.showFav}>Favorites:</span> {props.totalFavorites}

    </div>
  );
}
 
export default ProfileInfo;
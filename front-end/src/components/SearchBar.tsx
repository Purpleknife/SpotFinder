import React, { useEffect, useState } from 'react';

import { Coordinates } from './CreateMap';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';


interface SearchBarProps {
  coordinates: any[];
};

const SearchBar = (props: SearchBarProps) => {
  const [input, setInput] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const [results, setResults] = useState<any[]>([]);
  const [term, setTerm] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const navigate = useNavigate();
  
  /*
  useDebounce:
  To prevent API calls from being fired on every keystroke.
  The API should only fire when the user stops typing.
  */

  const useDebounce = (term: string, delay: number): string => {
    const [debounced, setDebounced] = useState(term);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebounced(term);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [term, delay]);

    return debounced;
  };

  // Fire the API call if input hasn't been updated within the last 500ms.
  const value = useDebounce(input, 500);


  // List the locations so the user can choose from them:
  const coorList = props.coordinates?.map((coor: Coordinates) => {
    return (
      <option 
        key={coor.id}
        value={coor.city}
      >
        {coor.city}, {coor.province}, {coor.country}
      </option>
    )
  });

  useEffect(() => {
    setTerm(value);
  }, [value]);


  const loadSearchResults = async() => {
    if (term || location) {
      return axios.get('/search', {
        params: {
          title: term,
          location: location
        }
      })
        .then((res) => {
          console.log('search', res.data);
          setResults(res.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
    }

    if (!term && !location) {
      setResults([]);
      setShowSearch(false);
      return;
    }
  };

  useEffect(() => {
    loadSearchResults();
  }, [term, location]);

  useEffect(() => {
    if (!showSearch && results.length > 0) {
      setShowSearch(true);
    }
    if (!results.length) {
      setShowSearch(false);
    }
  }, [results]);


  return (
    <div>
      <form onSubmit={event => event.preventDefault()}>
        <input
          className="search-field"
          placeholder="Search for maps..."
          spellCheck="false"
          name="search"
          type="search"
          value={input}
          onChange={event => setInput(event.target.value)}
        />
        
        <select 
          id="location"
          name="location"
          onChange = {(event) => {
            setLocation(event.target.value)}
          }
        >
          <option value="">Choose a location</option>
          {coorList}
        </select>

        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>

      {showSearch && 
          (<div className='results'>
            { results 
              ? results.map((result) => (
              <div 
                className="dropdown"
                key={result.id}
                onMouseDown={() => navigate(`/maps/${result.id}`, 
                  { state: {
                      id: result.id }
                  })}
              >
                <span>{result.title}</span>
              </div>
            ))
            : <div 
                className="dropdown"           
              >
            <span>No results.</span>
          </div>
            
            }
          </div>)}

    </div>
  );
}
 
export default SearchBar;

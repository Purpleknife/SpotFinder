import React, { useEffect, useState } from 'react';

import { Coordinates } from './CreateMap';

interface SearchBarProps {
  coordinates: any[];
};

const SearchBar = (props: SearchBarProps) => {
  const [input, setInput] = useState<string>('');
  const [location, setLocation] = useState<string>('');

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


  const coorList = props.coordinates?.map((coor: Coordinates) => {
    return (
      <option key={coor.id} value={coor.latitude +', '+ coor.longitude +', '+ coor.city +', '+ coor.province+', '+ coor.country}>
        {coor.city}, {coor.province}, {coor.country}
      </option>
    )
  });

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
        
        <select id="location" name="location">
          <option value="Choose a location">Choose a location</option>
          {coorList}
        </select>

        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
    </div>
  );
}
 
export default SearchBar;

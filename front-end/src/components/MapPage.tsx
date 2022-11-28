import {useLocation} from 'react-router-dom';

import MapView from './MapView';

const MapPage = () => {
  const location = useLocation();

  console.log('location', location.state)
  return (
    <>
      <MapView 
        key={location.state.key}
        id={location.state.id}
        latitude={location.state.latitude}
        longitude={location.state.longitude}
        allPins={location.state.allPins} />
    </>
  );
}
 
export default MapPage;
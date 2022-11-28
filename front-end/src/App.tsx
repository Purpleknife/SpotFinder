
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/maps/:map_id' element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
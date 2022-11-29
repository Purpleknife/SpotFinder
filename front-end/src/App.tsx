
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import Profile from './components/Profile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/maps/:map_id' element={<MapPage />} />
        <Route path='/profile/:user_id' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
import { Toaster } from 'react-hot-toast';
import SideMenu from './components/layout/SideMenu';
import {Route, Routes} from 'react-router';
import Home from './components/layout/Home';
import Standings from './components/Standings/Standings';
import Schedule from './components/Schedule/Schedule';
import Members from './components/Members/Members';
import Picks from './components/Picks/Picks'
import Rules from './components/Rules/Rules'
import Manage from "./components/Manage/Manage";

const App = () => {
  return (
      <>
        <SideMenu />
          <Routes>
              <Route path="/*" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/members" element={<Members />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/picks" element={<Picks />} />
              <Route path="/rules" element={<Rules />} />
          </Routes>
          <Toaster position='top-right' reverseOrder={false}  toastOptions={{
              duration: 3000,
              success: {
                  style: {
                      borderLeftColor: '#3daf8d',
                  },
                  iconTheme: {
                      primary: '#3daf8d',
                  },
              },
              error: {
                  duration: 5000,
                  iconTheme: {
                      primary: '#9e0442',
                  }
              }}} />
      </>
  );
};

export default App;

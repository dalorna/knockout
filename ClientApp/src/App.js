import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import SideMenu from './components/layout/SideMenu';
import {Route, Routes} from 'react-router';
import ErrorBoundary from './utils/errorBoundary';
import {Loading} from './utils/loading';


/*import Login from '../src/components/layout/Login';
import Register from '../src/components/layout/Register';
import Unauthorized from '../src/components/layout/Unauthorized';*/
import Home from '../src/components/layout/Home';
/* import Manage from '../src/components/Manage/Manage';
import Members from '../src/components/Members/Members';
import Schedule from '../src/components/Schedule/Schedule';
import Standings from '../src/components/Standings/Standings';
import Picks from '../src/components/Picks/Picks';
import Rules from '../src/components/Rules/Rules';*/



const App = () => {
  return (
      <>
          <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                  <SideMenu  />
              </Suspense>
          </ErrorBoundary>
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

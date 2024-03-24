import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import SideMenu from './components/layout/SideMenu';
import {Route, Routes} from 'react-router';
import Home from './components/layout/Home';
import Standings from './components/Standings/Standings';
import Schedule from './components/Schedule/Schedule';
import Members from './components/Members/Members';
import Picks from './components/Picks/Picks'
import Rules from './components/Rules/Rules'
import Manage from './components/Manage/Manage';
import ErrorBoundary from './utils/errorBoundary';
import {Loading} from './utils/loading';

const App = () => {
  return (
      <>
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
          <SideMenu />
          <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                  <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="home/:userId" element={<Home />} />
                      <Route path="manage/:userId/:leagueId?/:ruleId?" element={<Manage />} />
                      <Route path="members/:userId" element={<Members />} />
                      <Route path="schedule/:userId" element={<Schedule />} />
                      <Route path="standings/:userId" element={<Standings />} />
                      <Route path="picks/:userId" element={<Picks />} />
                      <Route path="rules:userId" element={<Rules />} />
                  </Routes>
              </Suspense>
          </ErrorBoundary>
      </>
  );
};

export default App;

import React, { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import SideMenu from './components/layout/SideMenu';
import ErrorBoundary from './utils/errorBoundary';
import {Loading} from './utils/loading';

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

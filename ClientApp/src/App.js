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
      </>
  );
};

export default App;

import './App.css';
import Toaster from 'react-hot-toast';
import SideNav from './components/layout/SideNav';

const App = () => {
  return (
      <>
        <SideNav />

        <Toaster position='top-right' reverseOrder={false} toastOptions={{
          duration: 3000,
          success: {
            style: {
              borderLeftColor: '#3daf8d'
            },
            iconTheme: {
              primary: '#3daf8d'
            }
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#9e0442'
            }
          }
        }} />
      </>
  );
};

export default App;

import useAuth from '../../state/useAuth';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';

const RequireRole = ({allowedRoles}) => {
    const [currentUser, ] = useRecoilState(currentUserAtom);
    const location = useLocation();


    return (
        currentUser?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : currentUser
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}
export default RequireRole;
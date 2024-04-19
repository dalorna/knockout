import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../state/useAuth';


const RequireLeague = ({allowedLeagues}) => {
    const { auth } = useAuth();
    const location = useLocation();
    const leagueIds = auth?.leagueIds ?? JSON.parse(localStorage.getItem('auth'))?.leagueIds;

    if (!auth?.user) {
        alert('auth.user missing (require league')
    }

    return (
        leagueIds.find(league => allowedLeagues?.includes(league))
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}
export default RequireLeague;


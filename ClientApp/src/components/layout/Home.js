import React, { useRef} from 'react';
import '../../styles/components.scss';
import {useCurrentSeason, useRefreshLeague} from '../../state/season';
import {CreateLeagueModal} from './CreateLeagueModal';
import toast from 'react-hot-toast';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';
import {JoinLeagueModal} from './JoinLeagueModal';

const Home = ({leagues, setLeagues, refreshSideMenu}) => {
    const [currentUser,] = useRecoilState(currentUserAtom);
    const season = useCurrentSeason();
    const createModalRef = useRef();
    const joinModalRef = useRef();
    const handleRefresh = useRefreshLeague();
    const yellow = '#f7f786';
    const red = '#ff0000';
    
    const create = () => {
        createModalRef.current.show(
            {
                user: currentUser,
                season: season.data[0]
            }
        )
    }
    const join = () => {
        joinModalRef.current.show(
            {
                user: currentUser
            }
        )
    }
    const refresher = (league) => {
        setLeagues([...leagues, league]);
        toast.success('League Successfully Saved')
    }
    const joinRefresher = () => {
        handleRefresh({member: {userId: currentUser.id}});
        refreshSideMenu();
    }

    return <div className="container py-1 text-center overflow-auto">
        <div className="row p-2 shadow-sm rounded bg-white mx-3">
            <h3>{`Welcome ${currentUser?.firstName} ${currentUser?.lastName}`}</h3>
        </div>
        <div className="row p-3 shadow-sm rounded bg-dark-subtle mx-3 mt-1">
            <h5>Create New League</h5>
            <div className="flex-container">
                <div className="button-3D">
                    <button onClick={create}>Create League</button>
                </div>
                <div className="button-3D">
                    <button onClick={join}>Join League</button>
                </div>
            </div>
        </div>
        <div className="row p-3 shadow-sm rounded bg-dark text-white mx-3 mt-1 overflow-auto">
            <h5>Feature enhancements</h5>
            <ol className="features text-start">
                <li>
                League Edit screen... leave league
                </li>
                <li>
                  Delete League...  deactivate league
                </li>
                <li style={{color: red}}>
                    Refresh on a page doesn't select the correct menu item
                </li>
                <li style={{color: red}}>
                    cap league with number of players if no private code 100 Max
                </li>
                <li style={{color: red}}>
                    Will need a profile page to set (address, city, state, zip) completely optional
                </li>
                <li style={{color: red}}>
                    Fix seasons
                </li>
                <li style={{color: yellow}}>
                    Join league screen, pick from leagues or enter a private code
                </li>
                <li>
                    Margin of victory to determine winner option?
                </li>
                <li style={{color: yellow}}>Who's still in, and or who is in the lead (standings)</li>
                <li style={{color: yellow}}>Some Sort of selection for the next week, with message to select by a
                    certain
                    time on home page
                </li>
                <li>We need to show the create league for a user in the role of manager</li>
                <li>Need to create roles, System Administrator, League Administrator, Player, Visitor?</li>
                <li>league standings, view other leagues (public leagues)</li>
                <li>Rules Engine</li>
                <li>Identity Server</li>

            </ol>
        </div>
        <div className="row p-3 shadow-sm rounded bg-danger-subtle mx-3 mt-1 overflow-auto">
            <h6>Bugs</h6>
            <ol className="features text-start">
                <li>
                    Toast messages everywhere
                </li>
            </ol>
        </div>
        <CreateLeagueModal actionsRef={createModalRef} afterSubmit={refresher} props={season.data[0]} />
        <JoinLeagueModal actionsRef={joinModalRef} afterSubmit={joinRefresher}  />
    </div>
}
export default Home;
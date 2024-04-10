import React, { useRef} from 'react';
import {useCurrentSeason} from '../../state/season';
import {CreateLeagueModal} from './CreateLeagueModal';
import toast from 'react-hot-toast';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';

const Home = ({leagues, setLeagues}) => {
    const [currentUser,] = useRecoilState(currentUserAtom);
    const season = useCurrentSeason();
    const createModalRef = useRef();
    const yellow = '#f7f786';
    const red = '#ff0000';
    const green = '#026311';
    
    const create =() => {
        createModalRef.current.show(
            {
                user: currentUser,
                season: season.data[0]
            }
        )
    }
    const refresher = (league) => {
        setLeagues([...leagues, league]);
        toast.success('League Successfully Saved')
    }
    return <div className="page container py-4 py-sm-5 text-center overflow-auto">
        <div className="row p-2 shadow-sm rounded bg-white mx-3">
            <h3>{`Welcome ${currentUser?.firstName} ${currentUser?.lastName}`}</h3>
        </div>
        <div className="row p-3 shadow-sm rounded bg-dark-subtle mx-3 mt-5">
            <h5>Create New League</h5>
            <div>
                <button className="btn btn-primary" onClick={create}>Create League</button>
            </div>
        </div>
        <div className="row p-3 shadow-sm rounded bg-dark text-white mx-3 mt-5">
            <h5>Feature enhancements</h5>
            <ol className="features text-start">
                <li>
                    League Edit screen or Delete League...
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
                <li style={{color: green}}>
                    Join league screen, pick from leagues or enter a private code
                </li>
                <li>
                    Margin of victory to determine winner option?
                </li>
                <li>Who's still in, and or who is in the lead</li>
                <li style={{color: yellow}}>Some Sort of selection for the next week, with message to select by a
                    certain
                    time on home page
                </li>
                <li>We need to show the create league for a user in the role of manager</li>
                <li>Need to create roles, System Administrator, League Administrator, Player, Visitor?</li>
                <li style={{color: red}}>Login Page</li>
                <li>league standings, view other leagues (public leagues)</li>
                <li>Rules Engine</li>
                <li>Identity Server</li>

            </ol>
        </div>
        <div className="row p-3 shadow-sm rounded bg-danger-subtle mx-3 mt-5">
            <h6>Bugs</h6>
            <ol className="features text-start">
                <li>
                    add scroll to Home page div
                </li>
                <li>
                    Toast messages everywhere
                </li>
            </ol>
        </div>
        <CreateLeagueModal actionsRef={createModalRef} afterSubmit={refresher} props={season.data[0]} />
    </div>
}
export default Home;
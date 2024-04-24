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
    
    const create = () => {
        createModalRef.current.show(
            {
                user: currentUser,
                season: season
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
        <div className="text-center">
            <div style={{fontSize: '2em'}} className="grey-begin text-shadow-black">{`Welcome ${currentUser?.firstName} ${currentUser?.lastName}`}</div>
        </div>
        <div className="row p-3 mx-3 mt-1 standard-background">
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
        <div className="row p-3 standard-background mx-3 mt-1 overflow-auto" style={{maxHeight: '60vh'}}>
            <h5>Feature enhancements</h5>
            <ol className="features text-start">
                <li>
                    League Edit screen (name, add season to league)... leave league
                </li>
                <li className="chiefs-red">
                    cap league with number of players if no private code 50 Max (max needs implemented)
                </li>
                <li>
                    Delete League... deactivate league
                </li>
                <li className="chiefs-gold">
                    3 fonts for the 3 sections (menu, header, content)
                </li>
                <li className="chiefs-red">
                    Disabled button needs to show disable with hover effect gone
                </li>
                <li className="chiefs-red">
                    Website Header reformat (Nav top)
                </li>
                <li className="chiefs-red">
                    standings page need created - Who's still in, and or who is in the lead (standings)
                </li>
                <li className="chiefs-red">
                    Will need a profile page to set (address, city, state, zip) completely optional
                </li>
                <li className="chiefs-red">
                    Can't pick after game start (probably need to have up until 5 minutes before game start
                </li>
                <li>
                    Margin of victory to determine winner option?
                </li>
                <li className="chiefs-gold">Some Sort of selection for the next week, with message to select by a
                    certain time on home page
                </li>
                <li>Create a private league cost money</li>
                <li>Need to create roles, System Administrator, League Administrator, Player, Visitor?</li>
                <li>league standings, view other leagues (public leagues)</li>
                <li>
                    Footer
                </li>
                <li>Rules Engine</li>
                <li>Identity Server</li>

            </ol>
        </div>
        <div className="row p-3 standard-background mx-3 mt-1 overflow-auto">
            <h6>Bugs</h6>
            <ol className="features text-start">
            <li>
                    Toast messages everywhere
                </li>
            </ol>
        </div>
        <CreateLeagueModal actionsRef={createModalRef} afterSubmit={refresher} props={season}/>
        <JoinLeagueModal actionsRef={joinModalRef} afterSubmit={joinRefresher}/>
    </div>
}
export default Home;
import React, { useRef} from 'react';
import {useCurrentSeason, useCurrentUser} from '../../state/rule';
import {CreateLeagueModal} from './CreateLeagueModal';
import toast from 'react-hot-toast';

const Home = ({leagues, setLeagues}) => {
    const user = useCurrentUser();
    const season = useCurrentSeason();
    const createModalRef = useRef();
    
    const create =() => {
        createModalRef.current.show(
            {
                user: user.data[0],
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
            <h3>{`Welcome ${user && user.data[0].firstName} ${user && user.data[0].lastName}`}</h3>
        </div>
        <div className="row p-3 shadow-sm rounded bg-dark-subtle mx-3 mt-5">
            <h5>Create New League</h5>
            <div>
                <button className="btn btn-primary" onClick={create}>Create League</button>
            </div>
        </div>
        <div className="row p-3 shadow-sm rounded bg-success mx-3 mt-5">
            <h5>Feature enhancements</h5>
            <ol className="features text-start">
                <li>
                    create season table, rules only locked for season
                </li>
                <li>
                    League Edit screen or Delete League...
                </li>
                <li>
                    Margin of victory to determine winner option?
                </li>
                <li>Who's still in, and or who is in the lead</li>
                <li style={{color: '#f7f786'}}>Create Picks UI</li>
                <li style={{color: '#f7f786'}}>Some Sort of selection for the next week, with message to select by a certain
                    time
                </li>
                <li>We need to show the create league for a user in the role of manager</li>
                <li>Need to create roles, System Administrator, League Administrator, Player, Visitor?</li>
                <li>Login Page</li>
                <li>Set up nfl feed</li>
                <li>league standings, view other leagues (public leagues)</li>
                <li>Rules Engine</li>
                <li>Identity Server</li>
            </ol>
        </div>
        <div className="row p-3 shadow-sm rounded bg-danger-subtle mx-3 mt-5">
            <h6>Bugs</h6>
            <ol className="features text-start">
                <li>
                    refresh save of rules
                </li>
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
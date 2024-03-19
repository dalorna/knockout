import React, {useRef} from 'react';
import {useCurrentUser} from '../../state/rule';
import {CreateLeagueModal} from './CreateLeagueModal';
import toast from 'react-hot-toast';

const Home = () => {
    const user = useCurrentUser();
    const createModalRef = useRef();
    
    const create =() => {
        createModalRef.current.show(
            {
                user: user.data[0]
            }
        )
    }
    const refresher = () => {
        toast.success('League Successfully Saved')
    }
    return <div className="page container py-4 py-sm-5 text-center">
        <div className="row p-3 shadow-sm rounded bg-white mx-3">
            <h1>Home</h1>
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
            <ul>
                <li>This should show something about where you stand in the league and what team you have picked this
                    week
                </li>
                <li> Current weeks games</li>
                <li>Who's still in, and or who is in the lead</li>
                <li>Some Sort of selection for the next week, with message to select by a certain time</li>
                <li>We need to show the create league for a user in the role of manager</li>
                <li>Need to create roles, System Administrator, League Administrator, Player, Visitor?</li>
                <li>Login Page</li>
                <li>Set up nfl feed</li>
                <li>Create Picks UI</li>
                <li>league standings</li>
                <li>Rules Engine</li>
                <li>Identity Server</li>
            </ul>
        </div>
        <div className="row p-3 shadow-sm rounded bg-danger-subtle mx-3 mt-5">
            <h6>Bugs</h6>
            <ul>
                <li>
                    refresh save of rules
                </li>
                <li>
                    refresh save of leagues
                </li>
                <li>
                    add scroll to Home page div
                </li>
                <li>
                    Toast messages everywhere
                </li>
                <li>
                    imperative ref for rules save
                </li>
            </ul>
        </div>
        <CreateLeagueModal actionsRef={createModalRef} afterSubmit={refresher} />
    </div>
}
export default Home;
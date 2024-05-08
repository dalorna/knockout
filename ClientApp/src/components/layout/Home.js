import React, {useEffect, useRef, useState} from 'react';
import '../../styles/components.scss';
import {seasonSelector, useCurrentSeason, useRefreshLeague, useResetSeason} from '../../state/season';
import {CreateLeagueModal} from './CreateLeagueModal';
import toast from 'react-hot-toast';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';
import {JoinLeagueModal} from './JoinLeagueModal';

const Home = ({leagues, setLeagues, refreshSideMenu}) => {
    const [currentUser,] = useRecoilState(currentUserAtom);
    const season = useCurrentSeason();
    const resetSeason = useResetRecoilState(seasonSelector);
    const createModalRef = useRef();
    const joinModalRef = useRef();
    const handleRefresh = useRefreshLeague();

    useEffect(() => {
        resetSeason()
    }, [])

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
            <div style={{fontSize: '2em'}}
                 className="grey-begin text-shadow-black">{`Welcome ${currentUser?.firstName} ${currentUser?.lastName}`}</div>
        </div>
        <div className="row p-3 mx-3 mt-1 standard-background">
            <h5>{`Create New League: ${season?.weeks?.find(f => f.isCurrent).name}`}</h5>
            <div className="flex-container">
                <div className="button-3D">
                    <button onClick={create}>Create League</button>
                </div>
                <div className="button-3D">
                    <button onClick={join}>Join League</button>
                </div>
            </div>
        </div>

        <div className="row p-3 standard-background mx-3 mt-1 overflow-auto" style={{height: '23vh'}}>
            <div>
                You haven't made your pick yet
            </div>
            <div>

            </div>
        </div>
        <div className="row p-3 standard-background mx-3 mt-1 overflow-auto" style={{height: '35vh'}}>
            <h5>Feature enhancements</h5>
            <ol className="features text-start">
                <li className="chiefs-red">
                    reset pass word in profile
                </li>
                <li className="chiefs-red">
                    reset pass word email from login
                </li>
                <li className="chiefs-red">
                    Send email to user with private code
                </li>
                <li className="chiefs-red">
                    Commissioner should see people who do not have pick yet for the week
                    (possibly send email to them)
                </li>
                <li className="chiefs-red">Some Sort of selection for the next week, with message to select by a
                    certain time on home page
                </li>
                <li className="chiefs-red">
                    league should run when user navigates to standings page... (first user there runs the league)
                </li>
                <li className="chiefs-red">
                    Will need a profile page to set (address, city, state, zip) completely optional. Change Password
                </li>
                <li>
                    Clean up constants for rules, and pretty much everything else that needs a constant. Clean up
                    folders and file with proper casing
                </li>
                <li>
                    Manage Page: deactivate league, and create new season after season finish, kick a member
                </li>
                <li>
                    League Edit screen (name, add season to league)... leave league (for a member)
                </li>
                <li>Create a private league cost money</li>
                <li>
                    3 fonts for the 3 sections (menu, header, content)
                </li>
                <li>Need to create role Visitor. Commissioner is done, SA is done, user is done</li>
                <li>
                    Footer
                </li>
                <li>
                    Website Header reformat (Nav top)
                </li>
            </ol>
        </div>
        <div className="row p-3 standard-background mx-3 mt-1 overflow-auto">
            <h6>Tests</h6>
            <ol className="features text-start">
                <li>
                    Test joining a locked league, user needs to have a dialog showing why
                </li>
            </ol>
        </div>
        <CreateLeagueModal actionsRef={createModalRef} afterSubmit={refresher} props={season}/>
        <JoinLeagueModal actionsRef={joinModalRef} afterSubmit={joinRefresher}/>
    </div>
}
export default Home;
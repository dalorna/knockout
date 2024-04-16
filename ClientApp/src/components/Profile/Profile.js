import {useTeams} from '../../state/season';
import '../../styles/radio.scss';
import {useEffect, useState} from 'react';

const Profile = () => {
    const teams = useTeams();
    const [favoriteTeam, setFavoriteTeam] = useState(null);

    useEffect(() => {
        const favorite = localStorage.getItem('favoriteTeam');
        if (favorite) {
            setFavoriteTeam(JSON.parse(localStorage.getItem('favoriteTeam')))
        }
    }, []);

    const onHandleClick = (e) => {
        localStorage.setItem('favoriteTeam', JSON.stringify({favoriteTeam: e.target.value}));
        setFavoriteTeam({favoriteTeam: e.target.value});
        document.body.classList.remove(...document.body.classList);
        document.body.classList.add(e.target.value);
    }


    return (
        <div className="container py-1 text-white">
            <div className="text-center text-shadow-black">
                <div className="header-fontSize grey-begin">Profile
                </div>
            </div>
            <div className="standard-background">
                <div className="text-center">
                    <h5 className={`${favoriteTeam?.favoriteTeam ? favoriteTeam?.favoriteTeam + '-color' : ''}`}>Select Your Favorite Team</h5>
                </div>
                <div className="team-grid">
                    {
                        teams.data.body.map(team => {
                            return (
                                <div key={team.teamID}>
                                    <input type="radio" className="football" value={teamsCSS[team.teamID - 1]}
                                           checked={teamsCSS[team.teamID - 1] === favoriteTeam?.favoriteTeam}
                                           id={team.teamID} onChange={(e) => onHandleClick(e)}/>
                                    <label htmlFor={team.teamID}>
                                    <span className="outer">
                                        <span className="inner">
                                        </span>
                                    </span>
                                        <p className="inlet">
                                        <span className={`text__effect ${teamsCSS[team.teamID - 1]}-color`}>
                                            {
                                                `${team.teamCity} ${team.teamName}`
                                            }
                                        </span>
                                        </p>
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="standard-background mt-2">
                <div className="text-center">
                    <h5 className={`${favoriteTeam?.favoriteTeam ? favoriteTeam?.favoriteTeam + '-color' : ''}`}>Coming
                        Soon !</h5>
                </div>
                <div>Change Password</div>
                <div>Change Email Address</div>
            </div>
        </div>
    )
}
export default Profile;

const teamsCSS = [
    'arizona', 'atlanta', 'baltimore', 'buffalo', 'carolina', 'chicago', 'cincinnati', 'cleveland', 'dallas', 'denver',
    'detroit', 'greenBay', 'houston', 'indianapolis', 'jacksonville', 'kansasCity', 'lasVegas', 'losAngelesChargers',
    'losAngelesRams', 'miami', 'minnesota', 'newEngland', 'newOrleans', 'newYorkGiants', 'newYorkJets',
    'pittsburgh', 'philadelphia', 'sanFrancisco', 'seattle', 'tampaBay', 'tennessee', 'washington']
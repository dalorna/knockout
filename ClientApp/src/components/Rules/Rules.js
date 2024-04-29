import {useSeasonLeague} from '../../state/season';

const Rules = () => {
    const selectedLeague = JSON.parse(localStorage.getItem('selectedLeague'));
    const leagueSeason = useSeasonLeague(selectedLeague._id);
    const favorite = JSON.parse(localStorage.getItem('favoriteTeam'));

    return <div className="page container py-1 text-white">
        <div className="text-center text-shadow-black">
            <div className="header-fontSize grey-begin text-shadow-black">Rules
            </div>
        </div>
        <div className="p-1 mx-3 mt-1 standard-background">
            <div className="text-center">
                <h4 className={`${favorite?.favoriteTeam}-color`}>Game Type</h4>
            </div>
            <ol>
                <li>Knockout Survivor - You must pick a winner each week. (Never the same team twice in a season)</li>
                <li>Loser Pool - You must pick a Loser each week.</li>
            </ol>
            <div>
                <p>
                    Your commissioner has chosen:&nbsp;&nbsp;
                    <span className="rule-selection text-shadow-black">
                    {
                        leagueSeason[0].rules.gameType === 'survivor' ? 'Survivor' : 'Loser'
                    }
                    </span>
                </p>
            </div>
        </div>
        <div className="p-1 mx-3 mt-1 standard-background">
            <div className="text-center">
                <h4 className={`${favorite?.favoriteTeam}-color`}>Elimination Style</h4>
            </div>
            <ol>
                <li>HardCore - You are eliminated after your first lose.</li>
                <li>One Mulligan - You may lose once during the season and still continue with the season.</li>
                <li>Two Mulligan - You may lose twice during the season and still continue with the season.</li>
                <li>Never Out - You are never out the game, no matter how many times you lose. Standings will sort by Points</li>
            </ol>
            <div>
                <p>You commissioner has chosen:&nbsp;&nbsp;
                    <span className="rule-selection text-shadow-black">
                    {
                        leagueSeason[0].rules.elimination === 'hardCore' && 'Hard Core'
                    }
                    {
                        leagueSeason[0].rules.elimination === 'oneMulligan' && 'One Mulligan'
                    }
                    {
                        leagueSeason[0].rules.elimination === 'twoMulligan' && 'Two Mulligan'
                    }
                    {
                        leagueSeason[0].rules.elimination === 'neverOut' && 'Never Out'
                    }
                    </span>
                </p>
            </div>
        </div>
        {
            leagueSeason[0].rules.elimination !== 'hardCore' &&
            <div className="p-1 mx-3 mt-1 standard-background">
                <div className="text-center">
                    <h4 className={`${favorite?.favoriteTeam}-color`}>Early Point</h4>
                </div>
                <div>
                    <p>You commissioner has chosen:&nbsp;&nbsp;
                        <span className="rule-selection text-shadow-black">
                            {
                                leagueSeason[0].rules.earlyPoint ? 'A early lose counts more than a Late loss' : 'A late lose counts more than a early lose'
                            }
                        </span>
                    </p>
                </div>
            </div>
        }
        {
        leagueSeason[0].rules.gameType === 'loser' && <>
                <div className="p-1 mx-3 mt-1 standard-background">
                    <div className="text-center">
                        <h4 className={`${favorite?.favoriteTeam}-color`}>Pick the same team</h4>
                    </div>
                    <div>
                        <p>You commissioner has chosen:&nbsp;&nbsp;
                            <span className="rule-selection text-shadow-black">
                                {
                                    leagueSeason[0].rules.cantPickSame ? 'I can pick the same team more than once' : `I cannot pick the same team more than once`
                                }
                            </span>
                        </p>
                    </div>
                </div>
                <div className="p-1 mx-3 mt-1 standard-background">
                    <div className="text-center">
                        <h4 className={`${favorite?.favoriteTeam}-color`}>See other's picks</h4>
                    </div>
                    <div>
                        <p>You commissioner has chosen:&nbsp;&nbsp;
                            <span className="rule-selection text-shadow-black">
                                {
                                    leagueSeason[0].rules.canSeePick ? `I can see other's pick before I pick` : `I cannot see other's pick before I pick`
                                }
                            </span>
                        </p>
                    </div>
                </div>
            </>
        }
        <div className="p-1 mx-3 mt-1 standard-background">
            <div className="text-center">
                <h4 className={`${favorite?.favoriteTeam}-color`}>Ties count as Loses</h4>
            </div>
            <div>
                <p>You commissioner has chosen:&nbsp;&nbsp;
                    <span className="rule-selection text-shadow-black">
                        {
                            leagueSeason[0].rules.ties ? 'Ties count as loses' : 'Ties count as a win for the week'
                        }
                    </span>
                </p>
            </div>
        </div>
    </div>
}
export default Rules;
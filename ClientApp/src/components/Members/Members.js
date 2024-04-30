import {useCurrentLeagueMembersUsers, useSeasonLeague} from '../../state/season';

const Members = () => {
    const selectedLeagueValue = JSON.parse(localStorage.getItem('selectedLeague'));
    const leagueSeason = useSeasonLeague(selectedLeagueValue._id);
    const users = useCurrentLeagueMembersUsers(selectedLeagueValue._id);

    return <div className="container py-1">
        <div className="text-center">
            <div className="header-fontSize grey-begin text-shadow-black">Members</div>
        </div>
        <div>
            <div className="member-display commissioner" style={{marginLeft: 'auto', marginRight: 'auto', top: '-10px'}}>
                <div className="chiefs-gold text-center">
                    <h4 className="text-shadow-black">Commissioner</h4>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <td rowSpan="2"><i className="fa fa-user member chiefs-gold text-shadow-black"/></td>
                        <td className="p-1">
                            <div>
                    <span>
                        {
                            `${users?.find((user) => user._id === selectedLeagueValue.userId)?.username}: `
                        }
                    </span>
                                <span>
                        {
                            `${users?.find((user) => user._id === selectedLeagueValue.userId)?.firstName} ${users?.find((user) => user._id === selectedLeagueValue.userId)?.lastName}`
                        }
                    </span>
                            </div>
                            <div>
                    <span>
                        {
                            `${users?.find((user) => user._id === selectedLeagueValue.userId)?.email} `
                        }
                    </span>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="member-grid">
            {
                leagueSeason[0].members.map((member, i) => {
                    return (
                        <MemberDisplayCard key={i} user={users.find((user) => user._id === member.userId)}/>
                    )
                })
            }
        </div>
    </div>
}

export default Members;

const MemberDisplayCard = ({user}) => {
    return (
        <div className={`member-display`}>
            <table>
                <tbody>
                    <tr>
                        <td rowSpan="2" ><i className="fa fa-user member text-shadow-black"/></td>
                        <td className="p-2">
                            <div>
                                <div className="cut-text d-inline">
                                    {
                                        `${user.username}: `
                                    }
                                </div>
                                <div className="cut-text d-inline">
                                    {
                                        `${user?.firstName} ${user?.lastName}`
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="cut-email  d-inline">
                                    {
                                        `${user.email}`
                                    }
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
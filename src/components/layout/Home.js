import {useCurrentUser} from '../../state/rule';

const Home = () => {
    const user = useCurrentUser();
    return <div className="page container py-4 py-sm-5 text-center">
        <div className="row p-3 shadow-sm rounded bg-white mx-3">
            <h1>Home</h1>
            <h3>{`Welcome ${user && user.data[0].firstName} ${user && user.data[0].lastName}`}</h3>
        </div>
        <div className="row p-3 shadow-sm rounded bg-white mx-3 mt-5">
            This should show something about where you stand in the league and what team you have picked this week
        </div>
        <div className="row p-3 shadow-sm rounded bg-white mx-3 mt-5">
            Current weeks games
        </div>
        <div className="row p-3 shadow-sm rounded bg-white mx-3 mt-5">
            Who's still in, and or who is in the lead
        </div>
        <div className="row p-3 shadow-sm rounded bg-white mx-3 mt-5">
            Some Sort of selection for the next week, with message to select by a certain time
        </div>
        <div className="row p-3 shadow-sm rounded bg-white mx-3 mt-5">
            We need to show the create league for a user in the role of manager
        </div>
        <div className="row p-3 shadow-sm rounded bg-white mx-3 mt-5">
            Need to create roles, System Administrator, League Administrator, Player, Visitor?
        </div>

    </div>
}
export default Home;
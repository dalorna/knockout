import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {useNavigate, useLocation} from 'react-router-dom';
import '../../styles/teams.scss';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import React, {Suspense, useEffect, useState} from 'react';
import {useCurrentLeagues} from '../../state/season';
import {Route, Routes} from 'react-router';
import { Link } from 'react-router-dom';
import Home from './Home';
import {Loading} from '../../utils/loading';
import Manage from '../Manage/Manage';
import Members from '../Members/Members';
import Standings from '../Standings/Standings';
import Picks from '../Picks/Picks';
import Rules from '../Rules/Rules';
import Join from '../Join/Join';
import Profile from '../Profile/Profile';
import Unauthorized from '../Auth/Unauthorized';
import useAuth from '../../state/useAuth';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';
import {generateUUID} from '../../utils/helpers';
import SimpleModal from '../../utils/simpleModal';
import RequireLeague from '../Auth/RequireLeague';
import RequireRole from '../Auth/RequireRole';
import {ROLES} from '../../utils/constants';
import Admin from '../Admin/Admin';

const SideMenu = () => {
  const {auth, setAuth } = useAuth();
  const leagues = useCurrentLeagues();
  const [currentUser,] = useRecoilState(currentUserAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const [allLeagues, setAllLeagues] = useState([]);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [show, setShow] = useState(false);
  const [refreshLeagues, setRefreshLeagues] = useState('');
  const [modalProps , setModalProps]= useState({ modalTitle: 'Pick a League', modalBody: 'You Must pick a league before you can access the menu!', handleClose: () => setShow(false)});

  useEffect(() => {
    setAllLeagues(leagues);
    let selectedLeagueStorage = localStorage.getItem('selectedLeague');
    if (leagues.length === 0 || (selectedLeagueStorage && !leagues.find(f => f._id === JSON.parse(selectedLeagueStorage)._id))) {
      if (selectedLeagueStorage) {
        selectedLeagueStorage = null;
        localStorage.removeItem('selectedLeague')
      }
    }
    if (leagues.length > 0 && selectedLeagueStorage && leagues.find(f => f._id === JSON.parse(selectedLeagueStorage)._id))  {
      setCurrentLeague(JSON.parse(selectedLeagueStorage));
    } else {
      setCurrentLeague(null);
    }
  }, [refreshLeagues])

  useEffect(() => {
    const favorite = localStorage.getItem('favoriteTeam');
    if (favorite) {
      document.body.classList.add(JSON.parse(favorite).favoriteTeam);
    }
  }, [])

  const setSelectedLeague = (league) => {
    localStorage.setItem('selectedLeague', JSON.stringify(league));
    setCurrentLeague(league);
  }
  const showNoLeagueModal = () => {
    showNoLeague();
  }
  const canManage = () => {
    return (currentLeague && (currentLeague?.userId === currentUser.id));
  }
  const showNoLeague = () => {
    setModalProps(prev => {
      prev.modalBody = 'You Must pick a league before you can access the menu!';
      return prev;
    })
    setShow(true);
  }
  const logout = async () => {
    setAuth({});
    localStorage.removeItem('auth');
    navigate('/login');
  }
  const refreshHandler = () => {
    setRefreshLeagues(generateUUID());
  }
  const getClassName = (path, canDisable) => {
    let style = `side-nav-3D`
    if (canDisable) {
      style += (!currentLeague?._id ? ' disabled ' : '');
    }
    style +=  (location.pathname.substring(location.pathname.lastIndexOf('/') + 1) === path ? ' selected ' : '');
    return style;
  }
  const isAdmin = () => {
    return auth?.roles?.includes(ROLES.SA);
  }

  return<>
    <div>
      <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
        <Container>
          <h4 style={{color: 'white'}}>Survivor Pool</h4>
          <div>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Dropdown>
                  <DropdownButton title={currentLeague?.name ?? 'Select league'} variant="dark" id="leagueDropDown">
                    {
                      allLeagues.map(league => <Dropdown.Item key={league._id} onClick={() => setSelectedLeague(league)} >{league.name}</Dropdown.Item>)
                    }
                  </DropdownButton>
                </Dropdown>
                {/*<Nav.Link href="/home">Home</Nav.Link>*/}
                <Nav.Link onClick={() => logout()}>Log Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </div>
    <div>
      <div className="side-nav-1">
        <div id="home" className={getClassName('home')}>
          <Link className="find-me" to="home">Home</Link>
        </div>
        {
            canManage() && <div id="manage" className={getClassName('manage')}><Link to="manage">Manage</Link></div>
        }
        <div id="picks" className={getClassName('picks', true)}>
          <SafeLink disabled={!currentLeague?._id} callback={showNoLeagueModal} text="Picks"
                    path="picks"/>
        </div>
        <div id="members" className={getClassName('members', true)}>
          <SafeLink disabled={!currentLeague?._id} callback={showNoLeagueModal} text="Members"
                    path="members"/>
        </div>
        <div className={getClassName('standings', true)}>
          <SafeLink disabled={!currentLeague?._id} callback={showNoLeagueModal} text="Standings"
                    path="standings"/>
        </div>
        <div className={getClassName('rules', true)}>
          <SafeLink disabled={!currentLeague?._id} callback={showNoLeagueModal} text="Rules"
                    path="rules"/>
        </div>
        <div className={getClassName('join')}>
          <Link to="join">Join</Link>
        </div>
        <div className={getClassName('profile')}>
          <Link to="profile">Profile</Link>
        </div>
        {
            isAdmin() && <div id="admin" className={getClassName('admin')}>
              <Link to="admin">Admin</Link>
            </div>
        }
      </div>
    </div>
    <div>
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="home" element={<Home leagues={leagues} setLeagues={setAllLeagues} refreshSideMenu={refreshHandler} />} />
          <Route element={<RequireLeague allowedLeagues={currentUser.leagueIds?.map(m => m) ?? []} /> }>
            <Route path="manage" element={<Manage currentSelectedLeague={currentLeague} />} />
          </Route>
          <Route path="members" element={<Members />} />
          <Route path="standings" element={<Standings currentSelectedLeague={currentLeague} refreshSideMenu={refreshHandler} />} />
          <Route path="picks" element={<Picks />} />
          <Route path="rules" element={<Rules  />} />
          <Route path="profile" element={<Profile />} />
          <Route path="join" element={<Join refreshSideMenu={refreshHandler} />} />
          <Route path="*" element={<Unauthorized />} />
          <Route element={<RequireRole allowedRoles={[ROLES.SA]} />} >
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
    <SimpleModal props={modalProps} show={show} />
  </>
}
export default SideMenu;

const SafeLink = ({disabled, callback, text, path}) => {
  return (
      <>
        {
          disabled ? <button type="button" onClick={callback} >{text}</button> : <Link to={path}>{text}</Link>
        }
      </>
  );
}
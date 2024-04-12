import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {useNavigate, useLocation} from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { signal } from '@preact/signals';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import React, {Suspense, useEffect, useState} from 'react';
import SimpleModal from '../../utils/simpleModal';
import {useCurrentLeagues} from '../../state/season';
import {Route, Routes} from 'react-router';
import Home from './Home';
import {Loading} from '../../utils/loading';
import Manage from '../Manage/Manage';
import Members from '../Members/Members';
import Schedule from '../Schedule/Schedule';
import Standings from '../Standings/Standings';
import Picks from '../Picks/Picks';
import Rules from '../Rules/Rules';
import Join from '../Join/Join';
import useAuth from '../../state/useAuth';
import {useRecoilState} from 'recoil';
import {currentUserAtom} from '../../state/user';
import {generateUUID} from '../../utils/helpers';

const currentSelectedLeague = signal(null);

const SideMenu = () => {
  const { setAuth } = useAuth();
  const leagues = useCurrentLeagues();
  const [currentUser,] = useRecoilState(currentUserAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const [allLeagues, setAllLeagues] = useState([]);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [show, setShow] = useState(false);
  const [refreshLeagues, setRefreshLeagues] = useState('')
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
      currentSelectedLeague.value = JSON.parse(selectedLeagueStorage);
      setCurrentLeague(JSON.parse(selectedLeagueStorage));
    } else {
      setCurrentLeague(null);
    }
  }, [refreshLeagues])

  const setSelectedLeague = (league) => {
    currentSelectedLeague.value = league;
    localStorage.setItem('selectedLeague', JSON.stringify(league));
    setCurrentLeague(league);
  }
  const showDisabledModal = () => {
    if (canManage()) {
      setModalProps(prev => {
        prev.modalBody = 'Only the league creator may change the rules and manage the league.';
        return prev;
      })
      setShow(true);
    }
    showNoLeague();
  }
  const showNoLeagueModal = () => {
    showNoLeague();
  }
  const canManage = () => {
    return !(currentSelectedLeague.value && (currentSelectedLeague.value?.userId === currentUser.id));
  }
  const showNoLeague = () => {
    if (!currentSelectedLeague.value?._id) {
      setModalProps(prev => {
        prev.modalBody = 'You Must pick a league before you can access the menu!';
        return prev;
      })
      setShow(true);
    }
  }
  const logout = async () => {
    setAuth({});
    navigate('/login');
  }
  const refreshHandler = () => {
    setRefreshLeagues(generateUUID());
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
      <SideNav onSelect={selected => {
        console.log('selected', selected);
        navigate(`${selected}`)
      }}>
        <SideNav.Toggle/>
        <SideNav.Nav defaultSelected="home">
          <NavItem  eventKey="home" data-tooltip-id="home-tip" data-tooltip-content="Home"
                    data-tooltip-variant="info">
            <Tooltip id="home-tip" place="top"/>
            <NavIcon><i className="fa fa-fw fa-home" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Manage</NavText>
          </NavItem>            
          <NavItem eventKey="manage" data-tooltip-id="manage-tip" data-tooltip-content="Manage League" disabled={canManage()} onClick={showDisabledModal}
                   data-tooltip-variant="info">
            <Tooltip id="manage-tip" place="top"/>
            <NavIcon><i className="fa fa-fw fa-briefcase" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Manage</NavText>
          </NavItem>
          <NavItem disabled={!currentSelectedLeague.value} onClick={showNoLeagueModal} eventKey="picks" data-tooltip-id="manage-tip" data-tooltip-content="Picks this week" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-clipboard" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Picks</NavText>
          </NavItem>
          <NavItem eventKey="members" data-tooltip-id="manage-tip" data-tooltip-content="League Memebers" disabled={!currentSelectedLeague.value} onClick={showNoLeagueModal}
                   data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-users" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Members</NavText>
          </NavItem>
          <NavItem eventKey="schedule" data-tooltip-id="manage-tip" data-tooltip-content="NFL Schedule" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-calendar-days" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Schedule</NavText>
          </NavItem>
          <NavItem disabled={!currentSelectedLeague.value} onClick={showNoLeagueModal} eventKey="standings" data-tooltip-id="manage-tip" data-tooltip-content="League Standings" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-line-chart" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Standings</NavText>
          </NavItem>
          <NavItem disabled={!currentSelectedLeague.value} onClick={showNoLeagueModal} eventKey="rules" data-tooltip-id="manage-tip" data-tooltip-content="League Rules" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-list-alt" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Rules</NavText>
          </NavItem>
          <NavItem eventKey="join" data-tooltip-id="join-tip" data-tooltip-content="Join a New league" data-tooltip-variant="info">
            <Tooltip id="join-tip" place="top"/>
            <NavIcon><i className="fa fa-fw fa-user-plus" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Join a new league</NavText>
          </NavItem>          
        </SideNav.Nav>
      </SideNav>
    </div>
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="home" element={<Home leagues={leagues} setLeagues={setAllLeagues} refreshSideMenu={refreshHandler} />} />
          <Route path="manage" element={<Manage currentSelectedLeague={currentSelectedLeague} />} />
          <Route path="members" element={<Members currentSelectedLeague={currentSelectedLeague} />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="standings" element={<Standings currentSelectedLeague={currentSelectedLeague} />} />
          <Route path="picks" element={<Picks currentSelectedLeague={currentSelectedLeague} />} />
          <Route path="rules" element={<Rules currentSelectedLeague={currentSelectedLeague} />} />
          <Route path="join" element={<Join refreshSideMenu={refreshHandler} />} />
        </Routes>
      </Suspense>
    </div>
    <SimpleModal props={modalProps} show={show} />
  </>
}
export default SideMenu;

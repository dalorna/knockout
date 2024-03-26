import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {useNavigate} from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { signal } from '@preact/signals';
import {Dropdown} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {Route, Routes} from 'react-router';
import Home from './Home';
import Manage from '../Manage/Manage';
import Members from '../Members/Members';
import Schedule from '../Schedule/Schedule';
import Standings from '../Standings/Standings';
import Picks from '../Picks/Picks';
import Rules from '../Rules/Rules';
import SimpleModal from '../../utils/simpleModal';
import {useCurrentLeagues} from '../../state/rule';
import Join from '../Join/Join';

const currentSelectedLeague = signal(null);

const SideMenu = () => {
  const leagues = useCurrentLeagues();
  const navigate = useNavigate();
  const [allLeagues, setAllLeagues] = useState([]);
  const [league, setLeague] = useState('Select League');
  const [show, setShow] = useState(false);
  const modalProps = { modalTitle: 'Pick a League', modalBody: 'You Must pick a league before you can access the menu!', handleClose: () => setShow(false)};
  
  useEffect(() => {
    setAllLeagues(leagues);
    let selectedLeagueStorage = localStorage.getItem('selectedLeague');
    if (selectedLeagueStorage) {
      currentSelectedLeague.value = JSON.parse(selectedLeagueStorage);
    }
  }, [])

  const setSelectedLeague = (league) => {
    currentSelectedLeague.value = league;
    setLeague(league.name);
    localStorage.setItem('selectedLeague', JSON.stringify(league));
  }
  
  const getDisableMessage = () => {
    if (!currentSelectedLeague.value?.id) {
      setShow(true);
    }
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
                  <Dropdown.Toggle variant="dark" id="league-dropdown">
                    {league}
                  </Dropdown.Toggle>
                  <Dropdown.Menu id="leagueDropDown">
                    {
                      allLeagues.map(league => <Dropdown.Item key={league.id} onClick={() => setSelectedLeague(league)} >{league.name}</Dropdown.Item>)
                    }
                  </Dropdown.Menu>
                </Dropdown>
                {/*<Nav.Link href="/home">Home</Nav.Link>*/}
                <Nav.Link href="#link">Log Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </div>
    <div>
      <SideNav onSelect={selected => {
        navigate(`/${selected}`)
      }}>
        <SideNav.Toggle/>
        <SideNav.Nav defaultSelected="home">
          <NavItem  eventKey="home" data-tooltip-id="home-tip" data-tooltip-content="Home"
                    data-tooltip-variant="info">
            <Tooltip id="home-tip" place="top"/>
            <NavIcon><i className="fa fa-fw fa-home" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Manage</NavText>
          </NavItem>            
          <NavItem eventKey="manage" data-tooltip-id="manage-tip" data-tooltip-content="Manage League" disabled={!currentSelectedLeague.value} onClick={getDisableMessage}
                   data-tooltip-variant="info">
            <Tooltip id="manage-tip" place="top"/>
            <NavIcon><i className="fa fa-fw fa-briefcase" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Manage</NavText>
          </NavItem>
          <NavItem eventKey="members" data-tooltip-id="manage-tip" data-tooltip-content="League Memebers" disabled={!currentSelectedLeague.value} onClick={getDisableMessage}
                   data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-users" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Members</NavText>
          </NavItem>
          <NavItem eventKey="schedule" data-tooltip-id="manage-tip" data-tooltip-content="NFL Schedule" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-calendar-days" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Schedule</NavText>
          </NavItem>
          <NavItem disabled={!currentSelectedLeague.value} onClick={getDisableMessage} eventKey="standings" data-tooltip-id="manage-tip" data-tooltip-content="League Standings" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-line-chart" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Standings</NavText>
          </NavItem>
          <NavItem disabled={!currentSelectedLeague.value} onClick={getDisableMessage} eventKey="picks" data-tooltip-id="manage-tip" data-tooltip-content="Picks this week" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-clipboard" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Picks</NavText>
          </NavItem>
          <NavItem disabled={!currentSelectedLeague.value} onClick={getDisableMessage} eventKey="rules" data-tooltip-id="manage-tip" data-tooltip-content="League Rules" data-tooltip-variant="info">
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
      <Routes>
        <Route path="/" element={<Home leagues={leagues} setLeagues={setAllLeagues} />} />
        <Route path="/home" element={<Home leagues={leagues} setLeagues={setAllLeagues} />} />
        <Route path="manage/:leagueId?/:ruleId?" element={<Manage currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="members" element={<Members currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="standings" element={<Standings currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="picks" element={<Picks currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="rules" element={<Rules currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="join" element={<Join />} />
      </Routes>
    </div>
    <SimpleModal props={modalProps} show={show} />
  </>
}
export default SideMenu;

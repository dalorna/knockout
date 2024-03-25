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
import {getLeagues} from '../../api/league';
import {useUser} from '../../state/user';
import {Route, Routes} from 'react-router';
import Home from './Home';
import Manage from '../Manage/Manage';
import Members from '../Members/Members';
import Schedule from '../Schedule/Schedule';
import Standings from '../Standings/Standings';
import Picks from '../Picks/Picks';
import Rules from '../Rules/Rules';

const currentSelectedLeague = signal(null);

const SideMenu = () => {
  const userId = useUser();
  const [currentLeagues, setCurrentLeagues] = useState(null);
  const navigate = useNavigate();
  const [league, setLeague] = useState('Select League')
  
  useEffect(() => {
    const load = async () => {
      const l = await getLeagues(userId);
      setCurrentLeagues(l.data);
    };
    load().then(() => {});
  }, [])
  const setSelectedLeague = (league) => {
    currentSelectedLeague.value = league;
    setLeague(league.name)
  }
  
  const getDisableMessage = () => {
    if (!currentSelectedLeague.value?.id) {
      alert('select a league');
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
                        currentLeagues && currentLeagues.map(league => <Dropdown.Item key={league.id} onClick={() => setSelectedLeague(league)} >{league.name}</Dropdown.Item>)
                    }
                  </Dropdown.Menu>
                </Dropdown>
                <Nav.Link href="/home">Home</Nav.Link>
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
        </SideNav.Nav>
      </SideNav>
    </div>
    <div>
      <Routes>
        <Route path="/home" element={<Home currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="manage/:leagueId?/:ruleId?" element={<Manage currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="members" element={<Members currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="standings" element={<Standings currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="picks" element={<Picks currentSelectedLeague={currentSelectedLeague} />} />
        <Route path="rules" element={<Rules currentSelectedLeague={currentSelectedLeague} />} />
      </Routes>
    </div>
  </>
}
export default SideMenu;

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {useNavigate} from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const SideMenu = () => {
  const navigate = useNavigate();
  const userId = 'cfc555e0-4c96-4b1e-b50e-b858bd600686';
  return<>
    <div>
      <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
        <Container>
          <h4 style={{color: 'white'}}>Survivor Pool</h4>
          <div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/home/cfc555e0-4c96-4b1e-b50e-b858bd600686">Home</Nav.Link>
                <Nav.Link href="#link">Log Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </div>
    <div>
      <SideNav onSelect={selected => {
        navigate(`/${selected}/${userId}`)
      }}>
        <SideNav.Toggle/>
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="manage" data-tooltip-id="manage-tip" data-tooltip-content="Manage League" data-tooltip-variant="info">
            <Tooltip id="manage-tip" place="top" />
            <NavIcon><i className="fa fa-fw fa-briefcase" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Manage</NavText>
          </NavItem>
          <NavItem eventKey="members" data-tooltip-id="manage-tip" data-tooltip-content="League Memebers" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-users" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Members</NavText>
          </NavItem>
          <NavItem eventKey="schedule" data-tooltip-id="manage-tip" data-tooltip-content="NFL Schedule" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-calendar-days" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Schedule</NavText>
          </NavItem>
          <NavItem eventKey="standings" data-tooltip-id="manage-tip" data-tooltip-content="League Standings" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-line-chart" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Standings</NavText>
          </NavItem>
          <NavItem eventKey="picks" data-tooltip-id="manage-tip" data-tooltip-content="Picks this week" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-clipboard" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Picks</NavText>
          </NavItem>
          <NavItem eventKey="rules" data-tooltip-id="manage-tip" data-tooltip-content="League Rules" data-tooltip-variant="info">
            <NavIcon><i className="fa fa-fw fa-list-alt" style={{fontSize: '1.5em'}}/></NavIcon>
            <NavText>Rules</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </div>
  </>
}
export default SideMenu;

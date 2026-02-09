import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useAuth } from '../Auth/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const { user, isLoading, logout } = useAuth();
  
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    history.push("/login");
  };

  return (
    <Navbar color="dark" dark expand="md" className="shadow-sm">
      <NavbarBrand tag={Link} to="/" className="fw-bold">
        MyApp
      </NavbarBrand>
      
      <NavbarToggler onClick={toggle} />
      
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          {user && (
            <>
              <NavItem>
                <NavLink tag={Link} to="/dashboard">
                  Dashboard
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
        
        <Nav className="ms-auto" navbar>
          {isLoading ? (
            // Show nothing or a skeleton while loading
            <NavItem>
              <span className="nav-link text-muted">...</span>
            </NavItem>
          ) : user ? (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="d-flex align-items-center">
                <span className="me-2">👤</span>
                {user.name || user.email || "User"}
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem tag={Link} to="/profile">
                  My Profile
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ) : (
            !isAuthPage && (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/login">
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/register" className="btn btn-primary btn-sm text-white ms-2">
                    Sign Up
                  </NavLink>
                </NavItem>
              </>
            )
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
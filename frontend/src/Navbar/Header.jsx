import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
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
import apiClient from '../apiClient';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const { data: user } = useQuery({
    queryKey: ["users/me"],
    queryFn: () => apiClient.get("/users/me").then(res => res.data),
    enabled: !isAuthPage,
    retry: false,
  });

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
      history.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
          {user ? (
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
            !user && (
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
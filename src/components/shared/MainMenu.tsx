import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Navbar, Nav, NavItem, NavLink, NavbarBrand, NavbarToggler, Collapse, Container } from "reactstrap";

export default function MainMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="light" light expand="md" fixed="top" className="border-bottom">
      <Container className="centered-container">
        <div className="d-flex w-100 justify-content-between align-items-center">
          <NavbarBrand tag={Link} to="/" className="d-flex align-items-center">
            <img 
              src="/favicon.svg" 
              alt="NAME Logo" 
              className="me-2" 
              style={{ width: "32px", height: "32px" }}
            />
            <strong className="d-none d-md-inline">Network of American Mensa Member Experts</strong>
            <strong className="d-inline d-md-none">NAME</strong>
          </NavbarBrand>
          
          {/* Desktop Navigation - Always visible on md+ screens */}
          <Nav className="d-none d-md-flex" navbar>
            {user ? (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/about">About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/experts">Experts</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/profile">Profile</NavLink>
                </NavItem>
                {user.role === "admin" && (
                  <NavItem>
                    <NavLink tag={Link} to="/admin">Admin</NavLink>
                  </NavItem>
                )}
                <NavItem>
                  <NavLink tag={Link} to="/feedback">Support</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    Logout
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/about">About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/feedback">Support</NavLink>
                </NavItem>
              </>
            )}
          </Nav>

          {/* Mobile Hamburger Button */}
          <NavbarToggler onClick={toggle} className="d-md-none" />
        </div>
        
        {/* Mobile Navigation - Collapsible */}
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto d-md-none" navbar>
            {user ? (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/experts">Experts</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/profile">Profile</NavLink>
                </NavItem>
                {user.role === "admin" && (
                  <NavItem>
                    <NavLink tag={Link} to="/admin">Admin</NavLink>
                  </NavItem>
                )}
                <NavItem>
                  <NavLink tag={Link} to="/feedback">Support</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    Logout
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/feedback">Support</NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

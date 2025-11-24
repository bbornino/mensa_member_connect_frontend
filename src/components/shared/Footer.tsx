import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import styles from "./Footer.module.scss";

export default function Footer() {
  const { user, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <Row className="align-items-start">
          <Col md={6}>
            {/* Logo */}
            <div className={styles.logoContainer}>
              <Link to="/" className={styles.logoLink}>
                <img 
                  src="/favicon.svg" 
                  alt="NAMME Logo" 
                  className={styles.logo}
                />
                <span className={styles.siteName}>Network of American Mensa Member Experts</span>
              </Link>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.linksContainer}>
              {/* Platform Links */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Platform
                </h3>
                <ul className={styles.linkList}>
                  <li className={styles.listItem}>
                    <Link to="/about" className={styles.link}>
                      About
                    </Link>
                  </li>
                  {user && (
                    <li className={styles.listItem}>
                      <Link to="/experts" className={styles.link}>
                        Experts
                      </Link>
                    </li>
                  )}
                  <li className={styles.listItem}>
                    <Link to="/feedback" className={styles.link}>
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Account Links */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Account
                </h3>
                <ul className={styles.linkList}>
                  {user ? (
                    <>
                      <li className={styles.listItem}>
                        <Link to="/profile" className={styles.link}>
                          Profile
                        </Link>
                      </li>
                      {user.role === "admin" && (
                        <li className={styles.listItem}>
                          <Link to="/admin" className={styles.link}>
                            Admin
                          </Link>
                        </li>
                      )}
                      <li className={styles.listItem}>
                        <a 
                          href="#" 
                          onClick={handleLogout}
                          className={styles.link}
                        >
                          Logout
                        </a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className={styles.listItem}>
                        <Link to="/login" className={styles.link}>
                          Login
                        </Link>
                      </li>
                      <li className={styles.listItem}>
                        <Link to="/register" className={styles.link}>
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              {/* Legal Links */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Legal
                </h3>
                <ul className={styles.linkList}>
                  <li className={styles.listItem}>
                    <Link to="/privacy-policy" className={styles.link}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li className={styles.listItem}>
                    <Link to="/terms-of-service" className={styles.link}>
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import styles from "./Welcome.module.scss";

export default function Welcome() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Network of American Mensa Member Experts";
  }, []);
  return (
    <div className={styles.welcomePage}>
      <Container className={styles.container}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>
            Expert member-to-member connections.
          </h1>        
          <p className={styles.heroSubtitle}>
          This interactive site is designed to bring together Mensa members who want to volunteer their expertise with those who may benefit from their guidance.
          </p>

          {/* Call-to-Action Section */}
          {user ? (
            <div className={styles.ctaSection}>
              <Link 
                to="/experts" 
                className={styles.ctaButton}
              >
                View Experts
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.ctaSection}>
                <Link 
                  to="/register" 
                  className={styles.ctaButton}
                >
                  Join
                </Link>
              </div>
              <p className={styles.loginPrompt}>
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className={styles.loginLink}
                >
                  Login here
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Feature Sections - Below main content */}
        <div className={styles.featuresContainer}>
          {/* First Feature Section - Text Left, Visual Right */}
          <Row className={`align-items-center ${styles.featureRow}`}>
            <Col md={6} className={styles.featureCol}>
              <h2 className={styles.featureHeading}>
                Share your expertise.
              </h2>
              <p className={styles.featureText}>
                Do you have a unique skill or passion that you want to share with other Mensa members?
              </p>
            </Col>
            <Col md={6}>
              <div className={styles.imageContainer}>
                <img 
                  src="/images/homepage/conversation-wireframe.png" 
                  alt="Two professionals engaged in conversation, sharing expertise"
                  className={styles.featureImage}
                />
              </div>
            </Col>
          </Row>

          {/* Second Feature Section - Visual Left, Text Right */}
          <Row className={`align-items-center ${styles.featureRow}`}>
            <Col md={6} className={`order-md-2 ${styles.featureCol}`}>
              <h2 className={styles.featureHeading}>
                Find mentorship.
              </h2>
              <p className={styles.featureText}>
                Are you looking for mentorship in your field, advice, or answers to specific questions outside your expertise?
              </p>
            </Col>
            <Col md={6} className="order-md-1">
              <div className={styles.imageContainer}>
                <img 
                  src="/images/homepage/conversation-minimalist.png" 
                  alt="Two professionals in consultation, finding mentorship"
                  className={styles.featureImage}
                />
              </div>
            </Col>
          </Row>

          {/* Team Section */}
          <Row className={`align-items-center ${styles.featureRow}`}>
            <Col md={12} className={styles.teamSection}>
              <div className={styles.teamHeader}>
                <p className={styles.teamHeaderText}>
                  This interactive site is designed to bring together Mensa members who want to volunteer their expertise with those who may benefit from their guidance.
                </p>
              </div>
              <div className={styles.teamImageContainer}>
                <img 
                  src="/images/homepage/team-professionals.png" 
                  alt="Diverse team of professionals collaborating"
                  className={styles.teamImage}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Beta Note */}
        <div className={styles.betaNote}>
          <p className={styles.betaText}>
            This platform is still in the beta-testing phase. Look for new features soon!
          </p>
        </div>

        {/* Bottom CTA Section */}
        <div className={styles.bottomCta}>
          <h2 className={styles.bottomCtaTitle}>
            Unlock new professional opportunities, insights, and impactful collaborations.
          </h2>
          {user ? (
            <div className={styles.bottomCtaButton}>
              <Link 
                to="/experts" 
                className={styles.ctaButton}
              >
                View Experts
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.bottomCtaButton}>
                <Link 
                  to="/register" 
                  className={styles.ctaButton}
                >
                  Join
                </Link>
              </div>
              <p className={styles.loginPrompt}>
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className={styles.loginLink}
                >
                  Login here
                </Link>
              </p>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

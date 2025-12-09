import { useEffect } from "react";
import { Container, Card, CardBody, CardTitle, Alert } from "reactstrap";
import styles from "./About.module.scss";

export default function About() {
  useEffect(() => {
    document.title = "About | Network of American Mensa Member Experts";
  }, []);
  return (
    <Container className="centered-container">
      <div className={styles.contentWrapper}>
        <Card className="text-dark bg-light m-3">
          <CardBody className={styles.cardBody}>
            <CardTitle tag="h1" className="text-center mb-4">
              <strong>About</strong>
            </CardTitle>

            <div className={styles.content}>
              <p className="mb-4">
                The <strong>Network of American Mensa Member Experts</strong> (NAMME) is a platform designed to help Mensa members share their expertise, collaborate on ideas, and support one another's goals. Whether you're looking for professional insight, creative collaboration, or simply to learn from another member's experience, this platform makes it easy to find and connect with the right people.
              </p>
              
              <p className="mb-5">
                By highlighting the diverse skills and knowledge within our community, NAMME aims to turn Mensa's collective intelligence into a practical resource for personal growth, innovation, and service. Members can search by interest or expertise, start conversations, and discover new opportunities to engage with others who share their passions.
              </p>

              <h2 className={`mb-3 ${styles.sectionHeading}`}>
                History
              </h2>
              
              <p className="mb-3">
                The idea for what became the <strong>Network of American Mensa Member Experts</strong> started with a simple desire: to make it easier for Mensa members to connect.
              </p>

              <p className="mb-3">
                At the 2025 Mensa Annual Gathering in Chicago, the Mensa Foundation held a workshop titled "How Can Mensa Address The Unmet Needs of Gifted Individuals." The session sparked a strong call from attendees for a way to link members who had knowledge to share with those seeking guidance. Around the same time, several Mensans were already exploring similar ideas, each envisioning a platform to bring expertise-sharing to life.
              </p>

              <p className="mb-3">
                Ian Strock, a long-time American Mensa leader, had been developing an offline version of such a network on Mensa Connect. Meanwhile, Michael Miller independently proposed a similar initiative, MensaMentors. These parallel efforts converged into one unified project, bringing together a talented volunteer team of web designers, engineers, and editors who collaborated to create what is now the Network of American Mensa Member Experts.
              </p>

              <h2 className={`mb-4 ${styles.sectionHeading}`}>
                Project Team
              </h2>
              
              <ul className={`mb-5 ${styles.teamList}`}>
                <li className="mb-2">
                  <strong>Briana Bornino</strong> – Engineering<br />
                  <span className={styles.localGroup}>Sacramento Regional Mensa</span>
                </li>
                <li className="mb-2">
                  <strong>Sandy Feder</strong> – Contributor<br />
                  <span className={styles.localGroup}>Sacramento Regional Mensa</span>
                </li>
                <li className="mb-2">
                  <strong>Billie Lee</strong> – Lead, Engineering<br />
                  <span className={styles.localGroup}>Southeast Michigan Mensa</span>
                </li>
                <li className="mb-2">
                  <strong>Celline Lee</strong> – UX<br />
                  <span className={styles.localGroup}>Greater New York Mensa</span>
                </li>
                <li className="mb-2">
                  <strong>Michael Miller</strong> – Content<br />
                  <span className={styles.localGroup}>Chicago Area Mensa</span>
                </li>
                <li className="mb-2">
                  <strong>Steve Roberts</strong> – Contributor<br />
                  <span className={styles.localGroup}>Central Texas Mensa</span>
                </li>
                <li className="mb-2">
                  <strong>Ian Randal Strock</strong> – Content, SIG Coordinator<br />
                  <span className={styles.localGroup}>Greater New York Mensa</span>
                </li>
              </ul>

              <Alert color="info" className="mt-4">
                <em>This platform is currently in a beta-testing phase. As membership grows, look for many new features to be added. If you have any suggestions or questions, please submit them by clicking the Support tab above.</em>
              </Alert>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}

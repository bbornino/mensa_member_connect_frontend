import { useEffect } from "react";
import { Container, Card, CardBody, CardTitle } from "reactstrap";
import styles from "./PrivacyPolicy.module.scss";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Network of American Mensa Member Experts";
  }, []);

  return (
    <Container className="centered-container">
      <div className={styles.contentWrapper}>
        <Card className="text-dark bg-light m-3">
          <CardBody className={styles.cardBody}>
            <CardTitle tag="h1" className="text-center mb-4">
              <strong>Privacy Policy</strong>
            </CardTitle>

            <div className={styles.content}>
              <p className={styles.lastUpdated}>
                <em>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
              </p>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>1. Introduction</h2>
                <p>
                  The Network of American Mensa Member Experts ("NAMME", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using NAMME, you consent to the data practices described in this policy.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>2. Information We Collect</h2>
                
                <h3 className={styles.subsectionHeading}>2.1 Information You Provide</h3>
                <p>We collect information that you voluntarily provide when you:</p>
                <ul>
                  <li>Create an account (name, email address, Mensa membership information)</li>
                  <li>Complete your profile (expertise areas, background, availability status)</li>
                  <li>Send connection requests or messages</li>
                  <li>Contact us for support</li>
                </ul>

                <h3 className={styles.subsectionHeading}>2.2 Automatically Collected Information</h3>
                <p>We may automatically collect certain information when you use our platform, including:</p>
                <ul>
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Usage data and interaction patterns</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Verify your Mensa membership status</li>
                  <li>Create and manage your account and profile</li>
                  <li>Facilitate connections between members</li>
                  <li>Send notifications about connection requests and messages</li>
                  <li>Improve our platform and user experience</li>
                  <li>Respond to your inquiries and provide support</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>4. Information Sharing and Disclosure</h2>
                
                <h3 className={styles.subsectionHeading}>4.1 Member Profiles</h3>
                <p>
                  Your profile information (name, expertise areas, background, availability status) is visible to other authenticated Mensa members using the platform. You control what information appears on your public profile.
                </p>

                <h3 className={styles.subsectionHeading}>4.2 Connection Requests</h3>
                <p>
                  When you send a connection request, the recipient will see your name, profile information, email address, and the message you send. This information is shared automatically with the recipient to facilitate communication and connection between members.
                </p>

                <h3 className={styles.subsectionHeading}>4.3 Service Providers</h3>
                <p>
                  We may share information with third-party service providers who perform services on our behalf, such as hosting, email delivery, and analytics. These providers are contractually obligated to protect your information.
                </p>

                <h3 className={styles.subsectionHeading}>4.4 Legal Requirements</h3>
                <p>
                  We may disclose your information if required by law, court order, or governmental authority, or to protect our rights, property, or safety, or that of our users.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>6. Your Rights and Choices</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access and review your personal information</li>
                  <li>Update or correct your profile information at any time</li>
                  <li>Delete your account and associated data</li>
                  <li>Control your privacy settings and profile visibility</li>
                  <li>Opt out of certain communications (while maintaining essential service notifications)</li>
                </ul>
                <p>
                  To exercise these rights, please contact us through the Support form or update your information directly through your profile settings.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>7. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and maintain your session. You can control cookie preferences through your browser settings, though this may affect platform functionality.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>8. Children's Privacy</h2>
                <p>
                  NAMME is intended for use by adult Mensa members only. We do not knowingly collect personal information from individuals under the age of 18. If you believe we have inadvertently collected such information, please contact us immediately.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>9. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the platform after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>10. Contact Us</h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us through the Support form on the platform.
                </p>
              </section>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}


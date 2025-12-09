import { useEffect } from "react";
import { Container, Card, CardBody, CardTitle } from "reactstrap";
import styles from "./TermsOfService.module.scss";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | Network of American Mensa Member Experts";
  }, []);

  return (
    <Container className="centered-container">
      <div className={styles.contentWrapper}>
        <Card className="text-dark bg-light m-3">
          <CardBody className={styles.cardBody}>
            <CardTitle tag="h1" className="text-center mb-4">
              <strong>Terms of Service</strong>
            </CardTitle>

            <div className={styles.content}>
              <p className={styles.lastUpdated}>
                <em>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
              </p>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using the Network of American Mensa Member Experts ("NAMME", "the Platform", "we", "us", or "our"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Platform.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>2. Eligibility</h2>
                <p>
                  The Platform is available exclusively to active members of American Mensa. By using NAMME, you represent and warrant that:
                </p>
                <ul>
                  <li>You are an active member of American Mensa in good standing</li>
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into these Terms</li>
                  <li>All information you provide is accurate and current</li>
                </ul>
                <p>
                  We reserve the right to verify your Mensa membership status and suspend or terminate accounts that do not meet these eligibility requirements.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>3. Account Registration and Security</h2>
                <p>When creating an account, you agree to:</p>
                <ul>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p>
                  You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>4. User Conduct</h2>
                <p>You agree to use the Platform in a manner that is lawful, respectful, and consistent with Mensa's values. You agree NOT to:</p>
                <ul>
                  <li>Use the Platform for any illegal or unauthorized purpose</li>
                  <li>Harass, abuse, threaten, or harm other members</li>
                  <li>Post false, misleading, or defamatory information</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Spam, solicit, or send unsolicited commercial communications</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with or disrupt the Platform's operation or security</li>
                  <li>Attempt to gain unauthorized access to any part of the Platform</li>
                  <li>Use automated systems to access the Platform without permission</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>5. Expert Services and Connections</h2>
                
                <h3 className={styles.subsectionHeading}>5.1 No Guarantee of Services</h3>
                <p>
                  NAMME is a platform for connecting members. We do not guarantee that any expert will respond to your connection request, provide services, or meet your expectations. All interactions between members are voluntary and at their own discretion.
                </p>

                <h3 className={styles.subsectionHeading}>5.2 No Professional Relationship</h3>
                <p>
                  The Platform facilitates connections but does not create any professional, legal, or fiduciary relationship between members. Any services provided through connections are between the members involved, and NAMME is not a party to such arrangements.
                </p>

                <h3 className={styles.subsectionHeading}>5.3 Compensation</h3>
                <p>
                  While initial consultations are expected to be voluntary, members may independently agree to compensation for extended services. NAMME is not involved in, responsible for, or liable for any financial arrangements between members.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>6. Content and Intellectual Property</h2>
                
                <h3 className={styles.subsectionHeading}>6.1 Your Content</h3>
                <p>
                  You retain ownership of any content you post on the Platform. By posting content, you grant NAMME a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content solely for the purpose of operating the Platform.
                </p>

                <h3 className={styles.subsectionHeading}>6.2 Platform Content</h3>
                <p>
                  All content on the Platform, including text, graphics, logos, and software, is the property of NAMME or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className={styles.subsectionHeading}>6.3 Prohibited Content</h3>
                <p>
                  You may not post content that is illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable. We reserve the right to remove any content that violates these Terms.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>7. Privacy</h2>
                <p>
                  Your use of the Platform is also governed by our Privacy Policy. Please review the Privacy Policy to understand how we collect, use, and protect your information.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>8. Disclaimers and Limitations of Liability</h2>
                
                <h3 className={styles.subsectionHeading}>8.1 Platform "As Is"</h3>
                <p>
                  The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or secure.
                </p>

                <h3 className={styles.subsectionHeading}>8.2 Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, NAMME, its volunteers, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Platform.
                </p>

                <h3 className={styles.subsectionHeading}>8.3 Member Interactions</h3>
                <p>
                  NAMME is not responsible for the conduct of any member, the quality of services provided, or any disputes that arise between members. You use the Platform and interact with other members at your own risk.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>9. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless NAMME, its volunteers, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Platform, your violation of these Terms, or your violation of any rights of another party.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>10. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate your account at any time, with or without cause or notice, for any reason, including violation of these Terms. You may also terminate your account at any time by contacting us through the Support form.
                </p>
                <p>
                  Upon termination, your right to use the Platform will immediately cease. We may delete your account and associated data, subject to our Privacy Policy and applicable legal requirements.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>11. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of the Platform after such changes constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>12. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Platform shall be resolved in the appropriate courts of the United States.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>13. Severability</h2>
                <p>
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionHeading}>14. Contact Information</h2>
                <p>
                  If you have questions about these Terms of Service, please contact us through the Support form on the Platform.
                </p>
              </section>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}






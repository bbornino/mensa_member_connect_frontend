import { Container, Card, CardBody, CardTitle, Alert } from "reactstrap";

export default function About() {
  return (
    <Container className="centered-container">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Card className="text-dark bg-light m-3">
          <CardBody style={{ padding: "2.5rem" }}>
            <CardTitle tag="h1" className="text-center mb-4">
              <strong>About</strong>
            </CardTitle>

            <div style={{ lineHeight: "1.8" }}>
              <p className="mb-4">
                The <strong>Network of American Mensa Member Experts</strong> (NAMME) is a platform designed to help Mensa members share their expertise, collaborate on ideas, and support one another's goals. Whether you're looking for professional insight, creative collaboration, or simply to learn from another member's experience, this platform makes it easy to find and connect with the right people.
              </p>
              
              <p className="mb-5">
                By highlighting the diverse skills and knowledge within our community, the Member Connection aims to turn Mensa's collective intelligence into a practical resource for personal growth, innovation, and service. Members can search by interest or expertise, start conversations, and discover new opportunities to engage with others who share their passions.
              </p>

              <h2 className="mb-3" style={{ fontSize: "1.75rem", fontWeight: "600", marginTop: "2rem" }}>
                History
              </h2>
              
              <p className="mb-3">
                The idea for what became the <strong>Network of American Mensa Member Experts</strong> started with a simple desire: to make it easier for Mensa members to connect.
              </p>

              <p className="mb-5">
                At the 2025 Mensa Annual Gathering in Chicago, a session titled "Meeting Unmet Needs of Gifted Individuals" sparked a strong call from attendees for a way to link members who had knowledge to share with those seeking guidance. Around the same time, several Mensans were already exploring similar ideas, each envisioning a platform to bring expertise-sharing to life.
              </p>

              <p className="mb-5">
                Ian Strock, a long-time American Mensa leader, had been developing an offline version of such a network on Mensa Connect. Meanwhile, Michael Miller independently proposed a similar initiative, MensaMentors. These parallel efforts converged into one unified project, bringing together a talented volunteer team of web designers, engineers, and editors who collaborated to create what is now the Network of American Mensa Member Experts.
              </p>

              <h2 className="mb-4" style={{ fontSize: "1.75rem", fontWeight: "600", marginTop: "2rem" }}>
                Project Team
              </h2>
              
              <ul className="mb-5" style={{ listStyle: "none", paddingLeft: "0" }}>
                <li className="mb-2">Celline Lee – New York</li>
                <li className="mb-2">Michael Miller – Chicago</li>
                <li className="mb-2">Bryan Lenderman – Central Indiana</li>
                <li className="mb-2">Sandy Feder – Sacramento</li>
                <li className="mb-2">Steve Roberts – Central Texas</li>
                <li className="mb-2">Briana Bornina – Sacramento</li>
                <li className="mb-2">Billie Lee – Southeast Michigan</li>
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

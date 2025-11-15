import { useEffect } from "react";
import { Card, CardBody, CardTitle, Button } from "reactstrap";
import { Link } from "react-router-dom";
import styles from "./Faq.module.scss";

type FAQItem = {
  question: string;
  answer: JSX.Element;
};

const faqItems: FAQItem[] = [
  {
    question: "How does this work?",
    answer: (
      <>
        <p>
          Think of the Network of American Mensa Member Experts (NAMME) as a curated talent
          directory that is only accessible to verified Mensans. Once you create a profile, you can browse
          member experts by specialty, see what they are comfortable helping with, and send a focused
          request for collaboration or advice.
        </p>
        <p>
          When you reach out, the expert receives a notification and can accept, decline, or ask follow-up
          questions. All introductions start within the platform so both sides stay in control of the pace
          and scope of the conversation.
        </p>
      </>
    ),
  },
  {
    question: "Who can participate?",
    answer: (
      <>
        <p>
          Any active member of American Mensa may create a profile, search for help, or volunteer
          as an expert. You can participate whether you want to offer expertise, seek guidance, or do both.
        </p>
        <p>
          At this time, non-members can browse public information about the project (like this FAQ)
          but need to join Mensa before logging in or contacting individual experts.
        </p>
      </>
    ),
  },
  {
    question: "What kinds of services can I offer or get?",
    answer: (
      <>
        <p>
          NAMME thrives on practical, time-bound help. Popular categories include:
        </p>
        <ul>
          <li>Career coaching, resume reviews, and interview prep</li>
          <li>Startup, product, or go-to-market advice</li>
          <li>STEM tutoring, research feedback, or data analysis</li>
          <li>Creative critiques covering writing, design, music, or performance</li>
          <li>Community leadership, event planning, or volunteer coordination tips</li>
        </ul>
        <p>
          If you have a specialty that is not listed yet, add it to your profile—the directory will grow
          with the interests of the community.
        </p>
      </>
    ),
  },
  {
    question: "How do I contact an expert?",
    answer: (
      <>
        <p>
          After logging in, navigate to the Experts area, open the profile you are interested in, and
          select <strong>Request Connection</strong>. You will be prompted to describe what you need, the
          desired timeline, and any relevant background. The expert can then reply with next steps or
          suggest another resource.
        </p>
        <p>
          For general inquiries (not tied to a specific expert), use the Support form so the volunteer
          team can point you to the best contact.
        </p>
      </>
    ),
  },
  {
    question: "Is there a cost to participate?",
    answer: (
      <>
        <p>
          No. The platform is built and moderated by volunteers for the benefit of Mensa members.
          Experts choose how much time they can give and may optionally discuss compensation if a request
          turns into longer-term work, but the expectation is that initial consultations begin as a
          volunteer exchange.
        </p>
      </>
    ),
  },
  {
    question: "How is my information protected?",
    answer: (
      <>
        <p>
          Only authenticated Mensa members can view expert profiles and contact details. You are in
          control of what you publish on your profile, and you can update or hide your availability at any
          time from the Profile page.
        </p>
        <p>
          Please avoid sharing sensitive personal data through public descriptions; keep detailed private
          information inside direct messages once trust is established.
        </p>
      </>
    ),
  },
  {
    question: "Can I change my availability or pause requests?",
    answer: (
      <>
        <p>
          Yes. Use the Profile page to toggle your availability status or edit the types of requests
          you are open to receiving. When marked as unavailable, your profile still appears in search
          results but is clearly labeled so members know not to expect a quick turnaround.
        </p>
      </>
    ),
  },
];

export default function Faq() {
  useEffect(() => {
    document.title = "FAQ | Network of American Mensa Member Experts";
  }, []);

  return (
    <div className="centered-container">
      <div className={styles.contentWrapper}>
        <Card className="text-dark bg-light m-3">
          <CardBody className={styles.cardBody}>
            <CardTitle tag="h1" className="text-center mb-4">
              <strong>Frequently Asked Questions</strong>
            </CardTitle>

            <p className={styles.introText}>
              NAMME is still a beta experience, but these answers cover the most common questions from
              members who want to connect, mentor, or collaborate. Need something else? Reach out using
              the Support link after the FAQ list.
            </p>

            {faqItems.map(({ question, answer }) => (
              <section key={question} className={styles.faqItem}>
                <h2 className={styles.question}>{question}</h2>
                <div className={styles.answer}>{answer}</div>
              </section>
            ))}

            <div className={styles.ctaCard}>
              <p className={styles.ctaHeading}>Still have questions?</p>
              <p className="mb-3">
                We would love to hear what else would help you make the most of the network.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Button tag={Link} to="/register" color="primary">
                  Create an Account
                </Button>
                <Button tag={Link} to="/feedback" color="secondary" outline>
                  Contact Support
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}


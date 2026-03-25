import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/constants";
import styles from "./ExpertShowcase.module.scss";

interface ExpertiseSample {
  industry: string;
  what_offering: string;
}

export default function ExpertShowcase() {
  const { user } = useAuth();
  const [expertises, setExpertises] = useState<ExpertiseSample[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}expertises/sample/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ExpertiseSample[]) => setExpertises(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <section className={styles.showcaseSection}>
        <p style={{ color: "red", textAlign: "center" }}>
          [Debug] ExpertShowcase fetch failed: {error}
        </p>
      </section>
    );
  }

  if (expertises.length === 0) {
    return (
      <section className={styles.showcaseSection}>
        <p style={{ color: "gray", textAlign: "center" }}>
          [Debug] ExpertShowcase: endpoint returned 0 records.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.showcaseSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          One community. A remarkable breadth of expertise.
        </h2>
        <p className={styles.sectionSubtitle}>
          Mensa members are professionals, researchers, hobbyists, and specialists
          across virtually every field imaginable. Here's a glimpse.
        </p>
      </div>

      <div className={styles.masonryGrid}>
        {expertises.map((item, index) => (
          <div key={index} className={styles.card}>
            <span className={styles.industryTag}>{item.industry}</span>
            <p className={styles.cardText}>{item.what_offering}</p>
          </div>
        ))}
      </div>

      <div className={styles.ctaWrapper}>
        {user ? (
          <Link to="/experts" className={styles.ctaButton}>
            Browse all experts
          </Link>
        ) : (
          <>
            <Link to="/register" className={styles.ctaButton}>
            Join to connect with these experts and many more.
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

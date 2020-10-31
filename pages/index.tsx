import Head from "next/head";
import styles from "../styles/Home.module.scss";
import MatchesDropZone from "components/matchesDropZone/MatchesDropZone";
import { useRef } from "react";
import Sankey from "components/matchVisualizations/Sankey/Sankey";
import activities from "data/matches.json";
import { getActivitiesByMatchType } from "components/matchVisualizations/utils";

export default function Home() {
  const examplesRef = useRef(null);

  // @ts-ignore
  const activityMap = getActivitiesByMatchType(activities);
  return (
    <div className={styles.container}>
      <Head>
        <title>Georney</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.splash}>
          <h1 className={styles.title}>Visualize Your Hinge Data</h1>

          {/* <p className={styles.description}>Democratizing Dating Data</p> */}
          <MatchesDropZone />
          <small className={styles.dropZoneText}>
            File is NOT uploaded to or saved on server. Verify{" "}
            <a href="https://github.com/commanderking/georney" target="_blank">
              the code
            </a>
            .
          </small>
          <div className={styles.actions}>
            <button className={styles.step}>
              <a
                href="https://hingeapp.zendesk.com/hc/en-us/articles/360011235813-How-do-I-request-a-copy-of-my-personal-data-"
                target="_blank"
              >
                Get my Hinge Data
              </a>
            </button>

            <button
              className={styles.step}
              onClick={() => {
                examplesRef &&
                  examplesRef.current.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See Visualizations
            </button>
          </div>
        </div>

        <div className={styles.examples} id="examples" ref={examplesRef}>
          <h3>Flow Chart (Sankey)</h3>
          <Sankey activityMap={activityMap} />
        </div>
        {/* <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
      </main>
    </div>
  );
}

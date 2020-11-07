import React, { useContext } from "react";
import styles from "styles/Home.module.scss";
import { UserMatchesContext } from "context/UserMatchesProvider";
import { getActivitiesByMatchType } from "components/matchVisualizations/utils";
import Sankey from "components/matchVisualizations/Sankey/Sankey";
import visualizeStyles from "./styles.module.scss";
import MatchesDropZone from "components/matchesDropZone/MatchesDropZone";

const Visualize = () => {
  const { data, setData } = useContext(UserMatchesContext);

  const activityMap = getActivitiesByMatchType(data);
  const {
    potentialMatches,
    actualMatches,
    sentLikesWithConversation,
    receivedLikesWithConversation,
    sentLikesWithMeeting,
    receivedLikesWithMeeting,
  } = activityMap;
  const noDataComponent = (
    <div className={styles.container}>
      <h1>Visualize your data</h1>
      <MatchesDropZone />
    </div>
  );

  const dataComponent = (
    <div className={styles.container}>
      <h1>Summary</h1>
      <div>Total Activity: {potentialMatches.length} </div>
      <div>Matches: {actualMatches.length} </div>
      <div>
        Conversations:{" "}
        {sentLikesWithConversation.length +
          receivedLikesWithConversation.length}
      </div>
      <div>
        Dates: {sentLikesWithMeeting.length + receivedLikesWithMeeting.length}
      </div>
      <h1>Activity Flow</h1>
      <div className={visualizeStyles.sankeyWrapper}>
        <Sankey activityMap={activityMap} />
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {data.length ? dataComponent : noDataComponent}
      </main>
    </div>
  );
};

export default Visualize;

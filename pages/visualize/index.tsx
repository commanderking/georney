import React, { useContext } from "react";
import styles from "styles/Home.module.scss";
import { UserMatchesContext } from "context/UserMatchesProvider";
import { getActivitiesByMatchType } from "components/matchVisualizations/utils";
import Sankey from "components/matchVisualizations/Sankey/Sankey";
import visualizeStyles from "./styles.module.scss";
const Visualize = () => {
  const { data, setData } = useContext(UserMatchesContext);

  const activityMap = getActivitiesByMatchType(data);

  if (!data.length) {
    return (
      <div className={styles.container}>
        <h1>No Data Yet</h1>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <h1>Your Data</h1>
      <div className={visualizeStyles.sankeyWrapper}>
        <Sankey activityMap={activityMap} />
      </div>
    </div>
  );
};

export default Visualize;

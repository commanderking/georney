import React from "react";
import { LegendData } from "features/spotify/types";
import styles from "./HeatMapLegend.module.scss";
type Props = {
  legendMap: LegendData[];
};

const HeatMapLegend = ({ legendMap }: Props) => {
  return (
    <div className={styles.container}>
      <h4>Legend - Play Count</h4>
      {legendMap.map((legend) => {
        return (
          <div key={legend.id}>
            <div
              className={styles.legendIcon}
              style={{
                backgroundColor: legend.color,
              }}
            ></div>
            <div className={styles.legendText}>{legend.displayText}</div>
          </div>
        );
      })}
    </div>
  );
};

export default HeatMapLegend;

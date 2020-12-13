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
          <div key={legend.displayText}>
            <div
              style={{
                backgroundColor: legend.color,
                width: "20px",
                height: "20px",
                display: "inline-block",
              }}
            ></div>
            <div
              style={{
                display: "inline-block",
                marginRight: "3px",
                marginLeft: "3px",
              }}
            >
              {legend.displayText}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeatMapLegend;

import React from "react";
import { LegendData } from "features/spotify/types";
import styles from "./HeatMapLegend.module.scss";
type Props = {
  legendMap: LegendData[];
};

const HeatMapLegend = ({ legendMap }: Props) => {
  return (
    <div className={styles.container}>
      <div
        style={{ display: "inline-block", marginRight: "3px", color: "gray" }}
      >
        {" "}
        Less{" "}
      </div>

      {legendMap.map((legend) => {
        return (
          <div style={{ display: "inline-block" }} key={legend.id}>
            <div
              className={styles.legendIcon}
              style={{
                backgroundColor: legend.color,
                border: "1px solid gray",
                marginRight: "1px",
              }}
            ></div>
          </div>
        );
      })}
      <div
        style={{ display: "inline-block", marginLeft: "3px", color: "gray" }}
      >
        {" "}
        More{" "}
      </div>
    </div>
  );
};

export default HeatMapLegend;

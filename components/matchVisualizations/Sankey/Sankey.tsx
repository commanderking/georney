import React from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { getSankeyData } from "../utils";
import { colorMap } from "../constants";
import styles from "./styles.module.css";

type Props = {
  activityMap: any;
};

const splitId = (label: string) => {
  return label.split(":")[0];
};

const Sankey = ({ activityMap }: Props) => {
  const data = getSankeyData(activityMap);
  return (
    <div className={styles.wrapper}>
      <ResponsiveSankey
        data={data}
        colors={[
          colorMap.GRAY,
          colorMap.SENT_LIKE,
          colorMap.RECEIVED_LIKE,
          colorMap.SENT_LIKE,
          colorMap.RECEIVED_LIKE,
          colorMap.SENT_LIKE,
          colorMap.RECEIVED_LIKE,
          colorMap.GRAY,
          colorMap.RECEIVED_LIKE,
        ]}
        linkOpacity={0.8}
        nodeOpacity={1}
        labelTextColor="black"
        linkTooltip={(node) => {
          const sourceLabel = splitId(node.source.id);
          const targetLabel = splitId(node.target.id);
          const text = `${node.value} ${targetLabel} from ${node.source.value} ${sourceLabel}`;
          return <span>{text}</span>;
        }}
      />
    </div>
  );
};

export default Sankey;

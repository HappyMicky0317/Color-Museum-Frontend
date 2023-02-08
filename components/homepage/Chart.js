import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { array } from "./array";
import styles from "../../styles/modules/homepage/thirdSection.module.css";
ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  let data = [];
  let colors = [];
  // eslint-disable-next-line
  array.map((item) => {
    data.push(item.percent);
    colors.push(item.color);
  });
  let dataPassed = {
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: colors,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className={styles.chartContainer}>
      <Doughnut data={dataPassed} />
    </div>
  );
};

export default Chart;

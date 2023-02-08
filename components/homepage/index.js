import React from "react";
import styles from "../../styles/modules/homepage/homepage.module.css";
import EightSection from "./EightSection";
import FifthSection from "./FifthSection";
import FirstSection from "./FirstSection";
import FourthSection from "./FourthSection";
import NinethSection from "./NinethSection";
import SecondSection from "./SecondSection";
import SeventhSection from "./SeventhSection";
import SixthSection from "./SixthSection";
import ThirdSection from "./ThirdSection";

const index = () => {
  return (
    <div className={styles.container}>
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <FifthSection />
      <SixthSection />
      <SeventhSection />
      <EightSection />
      <NinethSection />
    </div>
  );
};

export default index;

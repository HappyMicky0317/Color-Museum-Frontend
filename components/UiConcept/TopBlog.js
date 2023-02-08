import TextLoop from "@johnsdevelop/react-text-loop";
import { useEffect, useState } from "react";
import styles from "../../styles/modules/uiconcept/uiconcept.module.css";

const TopBlog = () => {
  const [animation, setAnimation] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setAnimation(!animation);
    }, 3000);
  }, [animation]);

  return (
    <section>
      {/* <TextLoop interval={10000} springConfig={{ stiffness: 200, damping: 5 }}> */}
      {animation ?
        <a
          className={styles.vice_container}
          target="_blank"
          rel="noreferrer"
          href="https://www.vice.com/en/article/3ab5k8/can-you-own-a-color-a-new-nft-marketplace-is-trying-to-find-out?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum"
        >
          <img src={"/images/logos/VICE.png"} alt="vice logo" />
          <h1>CAN YOU OWN COLORS?</h1>
          <div>Read</div>
        </a>
        :
        <a
          className={styles.vice_container}
          target="_blank"
          rel="noreferrer"
          href="https://designtaxi.com/news/417628/NFT-Color-Museum-Claims-You-Can-Own-Hues-Gain-Royalties-From-Them/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum"
        >
          <img src={"/images/logos/TAXI.png"} alt="taxi logo" />
          <h1>OWN HUES & GAIN ROYALTIES?</h1>
          <div>Read</div>
        </a>
      }
      {/* </TextLoop> */}
    </section>
  );
};

export default TopBlog;

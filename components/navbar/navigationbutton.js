import React, { useEffect } from "react";
import { BiNavigation } from "react-icons/bi";
import { motion } from "framer-motion";
import styles from "../../styles/modules/nav.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Toggle } from "../../store/actions/toggle";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";

const navigationbutton = () => {
  const router = useRouter();

  const variants = {
    rotate: { rotate: 90, transition: { duration: 0.6 } },
    stop: { rotate: 0, transition: { duration: 0.6 } },
  };
  const dispatch = useDispatch();
  const { toggle } = useSelector((state) => state.toggle);

  useEffect(() => {
    if (toggle && isMobile) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [toggle]);

  return (
    <div
      className={styles.navigation_button_wrapper}
      onClick={() => {
        dispatch(Toggle());
      }}
    >
      <motion.div
        variants={variants}
        animate={toggle ? "rotate" : "stop"}
        className={styles.menuIcon}
      >
        <BiNavigation color="#fff" size={18} />
      </motion.div>
      <span className={styles.navigation_button_text}> MENU</span>
    </div>
    // <div className={styles.navigation_button_wrapper} >
    //   <span className={`${styles.navigation_button_text} ${router.pathname == "/mint-concept" && styles.active} `}> Mint</span>
    //   <span className={`${styles.navigation_button_text} ${router.pathname == "/Trade" && styles.active} `}> Trade</span>
    //   <span className={`${styles.navigation_button_text} ${router.pathname == "/Earn" && styles.active} `}> Earn</span>
    // </div>
  );
};

export default navigationbutton;

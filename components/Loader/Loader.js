import randomColor from "randomcolor";
import { useEffect, useState } from "react";
import styles from "../../styles/modules/loader/loader.module.css";

const Loader = ({ small }) => {
  const [color, setColor] = useState(randomColor());
  useEffect(() => {
    const interval = setInterval(() => {
      setColor(randomColor());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  if (small) {
    return (
      <div
        className={styles.spinner_small}
        style={{ backgroundColor: color }}
      ></div>
    );
  }
  return (
    <div className={styles.spinner} style={{ backgroundColor: color }}></div>
  );
};

export default Loader;

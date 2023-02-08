import styles from "../../styles/modules/mobileOnly/mobile.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import Link from "next/link";
import Image from "next/image";

const MobileOnly = () => {
  return (
    <section className={styles.mobileOnly}>

      <div className={styles.loaderAndLogo}>
        <PuffLoader color="#fff" size={25} />
        <Link href="/" passHref>
          <div className={styles.topLogo}>
            <img
              src={"/images/logo.png"}
              alt="logo"
            />
          </div>
        </Link>
      </div>
      <h1>
        We are currently completing optimization of our marketplace product for
        mobile devices.
      </h1>
      <h3>
        For immediate access, visit{" "}
        <a href="https://color.museum/" target="_blank">
          www.color.museum
        </a>{" "}
        or&nbsp;
        <a href="https://color.museum/" target="_blank">
          www.colormuseum.com
        </a>{" "}
        on a desktop or laptop.
      </h3> 
    </section>
  );
};

export default MobileOnly;

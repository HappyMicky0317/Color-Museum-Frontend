import Gleap from "gleap";
import Link from "next/link";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/modules/footer.module.css";

const Footer = () => {
  const [animation, setAnimation] = useState(true);
  useEffect(() => {
    setAnimation(false);
    const timeout = setTimeout(() => {
      setAnimation(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation(false);
      const timeout = setTimeout(() => {
        setAnimation(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const [show, setShow] = useState(true);
  useEffect(() => {
    if (
      window.location.pathname === "/choose" ||
      window.location.pathname === "/name" ||
      window.location.pathname === "/describe" ||
      window.location.pathname === "/mint" ||
      window.location.pathname === "/mint-pending" ||
      window.location.pathname === "/mint-success" ||
      window.location.pathname === "/mint-failed" ||
      window.location.pathname.slice(0, 7) === "/change" ||
      window.location.pathname.slice(0, 16) === "/especificAmount"
    ) {
      setShow(false);
    } else setShow(true);
  }, []);

  const { fullWidthPage } = useSelector((state) => state.toggle);

  return (
    <>
      {show && (
        <footer className={`${fullWidthPage ? styles.footer : styles.footer}`}>
          <div className={styles.flex_container}>
            <div className={styles.container_footer}>
              <div>
                <h4>© Color Museum Limited</h4>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 18,
                    fontFamily: "sen",
                    fontWeight: "400",
                    color: "white",
                    display: "inline-block",
                  }}
                >
                  The world's first digital museum dedicated to color—and
                  <span
                    className={
                      animation
                        ? "animated_phrase_big"
                        : "animated_phrase_small"
                    }
                  >
                    {animation ? " meaning." : " money."}
                  </span>
                </p>
              </div>

              <div style={{ display: "flex" }}>
                <div>
                  {" "}
                  <h4 style={{ margin: "0px" }}>Est.2022</h4>
                </div>
                <div className={styles.footerLink}>
                  {" "}
                  <Link href="/terms">Terms</Link>
                </div>
                <div className={styles.footerLink}>
                  {" "}
                  <Link href="/privacy">Privacy</Link>
                </div>
              </div>
            </div>
            <div className={styles.container_footer}>
              <div className={styles.circle_container}>
                <div className={styles.flex}>
                  <div className={styles.circle} />
                  <h4>
                    <a href="https://status.color.museum" target={"_blank"}>
                      All systems operational.
                    </a>
                  </h4>
                </div>
                <div className={styles.report}>
                  {/* <Link href="/issues">REPORT AN ISSUE</Link> */}
                  <div
                    onClick={() => Gleap.startFeedbackFlow("bugreporting")}
                    style={{ cursor: "pointer", fontSize: "1rem" }}
                  >
                    REPORT AN ISSUE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;

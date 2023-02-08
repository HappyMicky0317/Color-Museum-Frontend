import React, { useEffect } from "react";
// import TagManager from "react-gtm-module";
import { isMobile } from "react-device-detect";

import styles from "../../styles/modules/privacy/privacy.module.css";

import { WarningOff } from "../../store/actions/toggle";
import { useDispatch } from "react-redux";

// TagManager.dataLayer({
//   dataLayer: {
//     event: "pageview",
//     pagePath: "/privacy",
//     pageTitle: "Privacy",
//   },
// });

const Privacy = () => {
  // const [subscribed, setSubscribed] = useState()
  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(WarningOff())
    // setSubscribed(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={styles.Wrapper} >
        <div className={styles.HeaderContainer} >
          {isMobile ? <a className={styles.EarlyAccess}>Early Access</a> : null}

          <h1>Privacy Policy</h1>
          <p>
            A user account is not required to conduct Ethereum smart contract
            transactions via the Color Museum website located at
            www.color.museum. If you register your email address on the Color NFT presale waitlist,
            we will store the provided address with our communications provider, SendGrid,
            for the purpose of providing you with email communications regarding Color Museum and its progression;
            as well to send you invitations to mint Color NFTs during the presale period.</p>
          <p>
            We use analytics software such as Plausible Analytics to measure site
            engagement in an effort to improve our products and user experience.
            We also deploy conversion tracking and retargeting pixels from various ad networks in an effort to improve our advertising
            campaigns. If you wish to opt-out from analytics and ad network tracking, we recommend you install an adblocker for your
            browser such as UBlock Origin.
          </p>
          <p>
            This privacy policy is subject to change, all revisions will be
            posted on this page.
          </p>
          <p>Last updated on December 31, 2021</p>
        </div>
      </div>
    </>
  );
};

export default Privacy;

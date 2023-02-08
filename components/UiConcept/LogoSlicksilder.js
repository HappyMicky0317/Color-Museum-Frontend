import React from "react";
import Marquee from "react-fast-marquee";
import logoSlider from "../../styles/modules/uiconcept/uiconcept.module.css";
import Image from "next/image";
import vice from "../../public/images/logos/VICE.png";
import THE_AUSTRALIAN from "../../public/images/logos/THE_AUSTRALIAN.png";
import THE_ATLANTIC from "../../public/images/logos/THE_ATLANTIC.png";
import TAXI from "../../public/images/logos/TAXI.png";
import BOINGBOING from "../../public/images/logos/Layer3.png";
import PRINT from "../../public/images/logos/PRINT.png";
import creativeBloqLogo from "../../public/images/logos/creativeBloqLogo.png";
import esquireLogo from "../../public/images/logos/esquireLogo.png";
import { isMobile } from "react-device-detect";

const LogoSlicksilder = () => {
  const Logos = [
    {
      src: vice,
      redirect:
        "https://www.vice.com/en/article/3ab5k8/can-you-own-a-color-a-new-nft-marketplace-is-trying-to-find-out?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum",
    },
    {
      src: TAXI,
      redirect:
        "https://designtaxi.com/news/417628/NFT-Color-Museum-Claims-You-Can-Own-Hues-Gain-Royalties-From-Them/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum",
    },
    {
      src: BOINGBOING,
      redirect:
        "https://boingboing.net/2022/02/05/someones-selling-the-rights-to-colors-as-nfts.html?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum",
    },
    {
      src: THE_AUSTRALIAN,
      redirect:
        "https://www.theaustralian.com.au/business/nfts-are-both-performance-art-and-a-silly-symptom-of-fomo-gone-mad/news-story/f7e2805d77359f94d42f18d54a2399b3?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum",
    },
    {
      src: THE_ATLANTIC,
      redirect:
        "https://www.theatlantic.com/technology/archive/2022/02/future-internet-blockchain-investment-banking/621480/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum",
    },
    {
      src: PRINT,
      redirect:
        "https://www.printmag.com/design-news/the-color-museum/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum",
    },
    {
      src: creativeBloqLogo,
      redirect: "https://www.creativebloq.com/news/nft-own-a-colour",
    },
    {
      src: esquireLogo,
      redirect:
        "https://www.esquiremag.ph/culture/tech/meta-nft-hype-color-museum-a00304-20220208",
    },
  ];
  return (
    <div className={logoSlider.logo_slider}>
      {isMobile ? (
        <>
          <Marquee
            speed={140}
            gradient={false}
            pauseOnHover={true}
            className={logoSlider.marquee_border}
          >
            {Logos.map((item, index) => {
              return (
                <div key={index} className={logoSlider.logo_item}>
                  <a href={item.redirect} target="_blank" rel="noreferrer">
                    {/* <img src={item.src} alt={item.name} /> */}
                    <Image src={item.src} alt="logo NFTs" />
                  </a>
                </div>
              );
            })}
          </Marquee>
        </>
      ) : (
        <>
          {Logos.map((item, index) => {
            return (
              <div key={index} className={logoSlider.logo_item}>
                <a href={item.redirect} target="_blank" rel="noreferrer">
                  {/* <img src={item.src} alt={item.name} /> */}
                  <Image src={item.src} alt="logo NFTs" />
                </a>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default LogoSlicksilder;

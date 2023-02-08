import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/homepage/seventhSection.module.css";
import Marquee from "react-fast-marquee";
import { dataDiscordPeople } from "./discordPeople";

const SeventhSection = () => {
  const [animation, setAnimation] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation((animation) => {
        if (animation === quotes.length - 1) {
          return 0;
        } else {
          return (animation += 1);
        }
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);
  const quotes = [
    {
      quote:
        "There are endless possibilities in taking the concept of color ‘ownership’ into the world of Web3. After speaking with the founder and gaining even more insights into the roadmap, I wanted in. I’m particularly excited about a marketplace that shares platform fees/royalties with the owners of Color NFTs, based on the percentage of that color used in the specific art. It’s exactly what Web3 is all about — Read, Write (Create), Own.",
      owner: "@trentmunday",
      colorName: "COLOR NFT NO. 9 ETHER SKY BLUE",
      color: "#9AEBFF",
      img: "/images/trendMuday.png",
    },
    {
      quote:
        "Colors should belong to everyone yet the idea of stamping my ownership on a single color in the world of web3 is so wickedly selfish, I had to jump at the chance to do it. I mean if Anish Kapoor could do it with Vanta Black, I suppose I could do it with Yves Klein Blau. This shade of blue represents my hope for the infinite possibilities of Color NFTs.",
      owner: "@jaustar",
      colorName: "COLOR NFT NO. 10 YVES KLEIN BLAU",
      color: "#1F18C0",
      img: "/images/jaustar.png",
    },
    {
      quote:
        "This is the best concept I’ve seen so far in the NFT world. I minted within 24 hours of hearing about this unique and sustainable project. It caught my attention immediately. This is still the beginning of the NFT era and Color Museum are paving the future of how the world views Non-Fungible Tokens. Truly excited and pumped about this.",
      owner: "@NedArcher1",
      colorName: "COLOR NFT NO. 16 TITIAN RED",
      color: "#BD5620",
      img: "/images/Depredation.jpg",
    },
    {
      quote:
        "I stumbled across this project as it was being criticized on a discussion board, and unlike the general consensus of all NFTs being a stain on humanity, I was immediately captivated by the idea of the Color Museum. I believe that the next successful NFT marketplace will require the support of the NFT community itself, and one way to do that is to reward those who are actively breathing life into this space, whether they are investors, creators, or anywhere in between. The Color Museum brings a whole new twist to the NFT ecosystem, and I definitely want to be a part of it.",
      owner: "@_Depredation_",
      colorName: "COLOR NFT NO. 19 BORED APE BEIGE",
      color: "#E3C8A1",
      img: "/images/NedArcher1.jpg",
    },
  ];
  return (
    <>
      <div className={styles.new_homepage_container}>
        <h3 className={styles.community_main_header}>
          Add&nbsp;<span>your color</span>
        </h3>
        <h2 className={styles.community_second_header}>To our commmunity.</h2>
        {quotes.map((item, index) => {
          if (index === animation) {
            return (
              <div className={styles.people_on_whitelist_quote} key={index}>
                <div className={styles.idea_img}>
                  <img src={"/images/quoteicon.png"} alt="quoteicon" />
                </div>
                <div className={styles.idea_content}>
                  <p className={styles.idea_des}>{item.quote}</p>
                  <div className={styles.right_quote}>
                    <img src={"/images/quoteicon.png"} alt="quoteicon" />
                  </div>
                  <div className={styles.owner_div}>
                    <div className={styles.owner_name}>
                      <div className={styles.image_container_owner}>
                        <img src={item.img} alt={item.img} />
                      </div>
                      <span>{item.owner}</span>
                    </div>
                    <div className={styles.owner_content}>
                      <p>
                        OWNER OF
                        <span style={{ color: item.color }}>
                          &nbsp;{item.colorName}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      <Marquee speed={140} gradient={false} pauseOnHover={true}>
        {dataDiscordPeople.map((item, index) => {
          return (
            <div key={index} className={styles.discord_card_container}>
              <a href={item.redirect} target="_blank" rel="noreferrer">
                <img src={item.src} alt={item.name} />
              </a>
            </div>
          );
        })}
      </Marquee>
    </>
  );
};

export default SeventhSection;

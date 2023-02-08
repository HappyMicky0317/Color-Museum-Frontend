import React, { useState } from "react";
import styles from "../../styles/modules/homepage/ninethSection.module.css";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const questions = [
  {
    id: 1,
    title: "What is a Color NFT?",
    info: "A Color NFT represents a new category of NFT: a Meta NFT. Essentially, a Meta NFT is usable as a building block to spawn new NFTs, or derivative NFTs—and other products and experiences limited only by the imagination of creators, and in the case of Color NFTs, what they can do with color.",
  },
  {
    id: 2,
    title: "Are Color NFTs random?",
    info: "A Color NFT is defined by the minter: you choose the exact color with hexadecimal precision, and also name it and describe it.",
  },
  {
    id: 3,
    title: "What is the max supply of Color NFTs?",
    info: " Only 10,000 colors will see the light.",
  },
  {
    id: 4,
    title:
      "Can the name and description associated with a Color NFT be changed?",
    info: "Yes, we plan to make this feature available in February—gasless updating of the Color NFT’s name and description by the NFT owner.",
  },
  {
    id: 5,
    title: "Can the color be changed?",
    info: "The color cannot be changed in any circumstance, as it is set at the tokenID level, which is the primary immutable component of the ERC-721 specification.",
  },
  {
    id: 6,
    title: "What is the Color Museum?",
    info: "The Color Museum is the gateway to the Color NFT ecosystem, leading the path and showing what’s possible with Color NFTs; starting with Color NFT staking on the Color Museum Market.",
  },
];
const Question = ({ title, info }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <article className={styles.faq_question}>
      <header>
        <button
          className={styles.faq_btn}
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? (
            <AiOutlineMinus className={styles.btn_minus} />
          ) : (
            <AiOutlinePlus />
          )}
        </button>
        <h4 onClick={() => setShowInfo(!showInfo)}> {title}</h4>
      </header>
      {showInfo && <p>{info}</p>}
    </article>
  );
};
const Faq = () => {
  return (
    <>
      <h1 className={styles.faq_header}>FREQUENTLY ASKED QUESTIONS</h1>
      <div className={styles.faq_info}>
        {questions.map((question) => {
          return <Question key={question.id} {...question}></Question>;
        })}
      </div>
    </>
  );
};

const NinethSection = () => {
  return (
    <div className={styles.faqs}>
      <div className={styles.new_homepage_container}>
        <div className={styles.faq_sec}>
          <div className={styles.left}>
            <Faq />
          </div>
          <a
            target="_blank"
            href="https://bulletin.color.museum/2022/02/the-color-nft-minting-experience-steps-to-follow/?utm_source=homepage&utm_medium=first40Colors&utm_campaign=febLaunch"
            style={{ textDecoration: "none" }}
            rel="noreferrer"
          >
            <div className={styles.right}>
              <div className={styles.right_inner}>
                <h2>INSTRUCTION</h2>
                <h1>Color NFT Minting: Pricing & Steps To Follow</h1>
                <p>
                  Priority and waitlist pricing, and best practices to follow to
                  ensure successful mints.
                </p>
                <img
                  src="/images/Instructions.jpg"
                  alt="blog preview"
                  className={styles.blogPreviewMobile}
                />
                <button className={styles.chooseButton}>View</button>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NinethSection;

import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/profile/profile.module.css";
import "react-tabs/style/react-tabs.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import Link from "next/link";
import { useSelector } from "react-redux";
import Atropos from "atropos/react";
import "atropos/css";
import Image from "next/image";
import Switch from "react-switch";




const Profile = ({ data }) => {
    const connectedAddress = '0X654Esdgsdfdh790B90';

    const [displayCard, setDisplayCard] = useState(false);
    const [sale, setSale] = useState(false);
    const [cardId, setCardId] = useState();

    const percentage = 30;

    return (
        <>
            <section className={styles.wrapper}>
                <div className={styles.profileTop}>
                    <div className={styles.profileTopColor}>

                    </div>
                    <div className={styles.profileDetails}>
                        <img src={"/images/boredApe.png"} alt="" />

                        <div className={styles.title}>
                            <h1>thesarahshow</h1>
                        </div>
                        <div className={styles.connectToken}>
                            {connectedAddress.substring(0, 6)}...
                            {connectedAddress.substring(connectedAddress.length - 6)}
                            <div className={styles.greenConnected} />
                        </div>
                        <div className={styles.userOwns}>
                            <h3>Owns 10 NFTs</h3>
                        </div>
                    </div>
                </div>
                <div className={styles.colorBoxWrapper}>
                    <div className={styles.colorBoxControler}>
                        <div className={styles.colorSelect}>
                            <span>Select Collection</span>
                            <img src={"/images/icon/arrow-bottom.svg"} alt="" />
                        </div>
                        <div className={styles.rightController}>
                            <div className={styles.switchItem}>
                                <label className={styles.switchLabel} htmlFor="small-radius-switch">
                                    <p>For Sale</p>
                                    <Switch
                                        checked={sale}
                                        onChange={() => setSale(!sale)}
                                        onColor="#00FF0A"
                                        onHandleColor="#000"
                                        offColor="#fff"
                                        offHandleColor="#000"
                                        handleDiameter={15}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={20}
                                        width={35}
                                        className={styles.react_witch}
                                    />
                                </label>
                            </div>
                            <div className={styles.colorSmallGrid}>
                                <img src={"/images/icon/color-list2.svg"} alt="" className={styles.icon} />
                            </div>
                            <div className={styles.colorLargeGrid}>
                                <img src={"/images/icon/color-list1.svg"} alt="" className={styles.icon} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.colorBoxView}>
                        {
                            data.documents.slice(0, 10).map((item, index) => {
                                return (
                                    <>
                                        <div className={styles.mainBox}>
                                            <div className={styles.colorBox}>
                                                <div className={styles.colorBoxHeader}>
                                                    <div className={styles.colorBoxTime}>
                                                        <div className={styles.colorBoxProcessBar}>
                                                            <CircularProgressbar
                                                                value={percentage}
                                                                styles={buildStyles({
                                                                    trailColor: '#4A4A4A',
                                                                    pathColor: '#fff',
                                                                })}
                                                            />
                                                        </div>
                                                        <span>29 MINUTES, 30 SECONDS LEFT</span>
                                                    </div>
                                                    <div className={styles.colorBoxLike}>
                                                        <img src={"/images/icon/like.png"} alt="like" />
                                                    </div>
                                                </div>
                                                <Link href={`/gallery/color-nft/${item.uint256}`} key={index}>
                                                    <a
                                                        className={styles.gridItem}
                                                        style={{ background: item.color }}
                                                        onMouseEnter={() => {
                                                            setDisplayCard(true);
                                                            setCardId(item.name + item.hex.slice(1));
                                                        }}
                                                        onMouseLeave={() => {
                                                            setDisplayCard(false);
                                                            setCardId("");
                                                        }}
                                                    >
                                                        <NFTCardContainerOnHover
                                                            id={item.uint256}
                                                            color={item.hex}
                                                            name={item.name}
                                                            number={item.nftNo}
                                                            displayCard={displayCard}
                                                            cardId={cardId}
                                                        />
                                                    </a>
                                                </Link>
                                            </div>
                                            <div className={styles.colorDetails}>
                                                <h6>
                                                    {item.name}
                                                </h6>
                                                <p><span>Highest bid:</span> {item.price_in_eth} ETH</p>
                                            </div>
                                        </div>
                                    </>
                                );
                            })
                        };
                    </div>
                </div>
            </section>
        </>
    );
};

export default Profile;


const NFTCardContainerOnHover = ({
    id,
    name,
    color,
    number,
}) => {
    const [fontSizeAmount, setFontSizeAmount] = useState("25");
    const [width, setWidth] = useState();
    useEffect(() => {
        setWidth(window.innerWidth);
    }, []);
    useEffect(() => {
        const handleResize = () => {
            let widthDimension = window.innerWidth;
            setWidth(widthDimension);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        if (name) {
            if (name.length < 10) {
                setFontSizeAmount(`${width < 350 ? "17.6" : "20"}`);
            } else if (name.length > 9 && name.length < 15) {
                setFontSizeAmount(`${width < 350 ? "16" : "17"}`);
            } else {
                setFontSizeAmount(`${width < 350 ? "12.8" : "12"}`);
            }
        }
        // eslint-disable-next-line
    }, [name]);
    //
    //

    const { whiteBorders } = useSelector((state) => state.minting);
    return (
        <Link href={`/gallery/color-nft/${id}`} passHref>
            <Atropos
                activeOffset={40}
                shadow={false}
            >
                <div
                    className={`${styles.recentlyBoxContainer} recentlyContainer`}
                    style={{
                        borderColor: `${whiteBorders.includes(color) ? "#1c1c1c" : color}`,
                        textDecoration: "none",
                        background: "#000",
                    }}
                >
                    <div className="containerContent">
                        <div
                            className="recentlyHeader"
                            style={{
                                borderBottom: `${whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                                    }`,
                            }}
                        >
                            <div className="flex_cardContainer">
                                <div className="logo_cardImage">
                                    <Image
                                        src={"/images/logo.png"}
                                        alt="logo NFTs"
                                        data-atropos-offset="5"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                            </div>
                            <div className="address" data-atropos-offset="5">
                                {number}
                            </div>
                        </div>
                        <div
                            className={`${styles.backgroundBoxContainer} backgroundContainer`}
                            style={{ background: `${color}` }}
                        ></div>
                        <div
                            className="recentlyHeader"
                            style={{
                                borderTop: `${whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                                    }`,
                                marginTop: "3px",
                            }}
                        >
                            <div
                                className="recentlyP"
                                style={{
                                    fontSize: `${fontSizeAmount}px`,
                                }}
                            >
                                {name}
                            </div>
                            <div
                                className="recentlyP margin_right"
                                style={{
                                    textTransform: "uppercase",
                                    fontSize: `${fontSizeAmount}px`,
                                    color: "#fff",
                                }}
                            >
                                {color}
                            </div>
                        </div>
                    </div>
                </div>
            </Atropos>
        </Link>
    );
};



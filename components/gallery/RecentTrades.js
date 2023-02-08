import React from "react";
import styles from "../../styles/modules/collection/collectionSingle.module.css";

const RecentTrades = () => {
    return (
        <section className={styles.Wrapper}>
            <div className={styles.InnerWrapper}>
                <article className={styles.secondContainer}>
                    <div className={styles.flexSecondContainer}>
                        <h1>Recent Trades</h1>
                    </div>
                    <div className={styles.CollectionTable}>
                        <div className={styles.CollectionTableHead}>
                            <h5 className={styles.headBox}>COLOR</h5>
                            <h5 className={styles.headName}>NAME</h5>
                            <h5 className={styles.headCode}>HEXADECIMAL</h5>
                            <h5 className={styles.headLastPrice}>LAST PRICE</h5>
                            <h5 className={styles.headETH}>
                                <b>$ |</b>
                                <span> ETH </span>
                            </h5>
                            <h5 className={styles.headBuyer}>BUYER</h5>
                            <h5 className={styles.headSeller}>SELLER</h5>
                            <h5 className={styles.headDate}>DATE</h5>
                            <h5 className={styles.headTx}>TX</h5>
                        </div>
                        <div className={styles.CollectionTableBody}>
                            <div className={styles.colorBox}>
                                <div
                                    className={styles.box}
                                    style={{ background: "#BADA55" }}
                                ></div>
                            </div>
                            <div className={styles.colorName}>BADASS</div>
                            <div className={styles.colorCode}>#BADA55</div>
                            <div className={styles.colorLastPrice}>
                                <b>$682.23</b>
                            </div>
                            <div className={styles.colorETH}>
                                <img src={"/images/uparrow.png"} alt="Sold" />
                                +2.5%
                            </div>
                            <div className={styles.colorBuyer}>morgan.eth</div>
                            <div className={styles.colorSeller}>0x87aa...ba42</div>
                            <div className={styles.colorDate}>2.22.2022 12:12 GMT</div>
                            <div className={styles.colorTx}>
                                <img src={"/images/arrow.png"} alt="Sold" />
                            </div>
                        </div>
                        <div className={styles.CollectionTableBody}>
                            <div className={styles.colorBox}>
                                <div
                                    className={styles.box}
                                    style={{ background: "#20C0BC" }}
                                ></div>
                            </div>
                            <div className={styles.colorName}>Mediterranean Turquoise</div>
                            <div className={styles.colorCode}>#20C0BC</div>
                            <div className={styles.colorLastPrice}>
                                <b>$723.57</b>
                            </div>
                            <div className={styles.colorETH}>
                                <img src={"/images/uparrow.png"} alt="Sold" />
                                +2.5%
                            </div>
                            <div className={styles.colorBuyer}>morgan.eth</div>
                            <div className={styles.colorSeller}>0x87aa...ba42</div>
                            <div className={styles.colorDate}>2.22.2022 12:16 GMT</div>
                            <div className={styles.colorTx}>
                                <img src={"/images/arrow.png"} alt="Sold" />
                            </div>
                        </div>
                        <div className={styles.CollectionTableBody}>
                            <div className={styles.colorBox}>
                                <div
                                    className={styles.box}
                                    style={{ background: "#DE1DE9" }}
                                ></div>
                            </div>
                            <div className={styles.colorName}>Purple Nurple</div>
                            <div className={styles.colorCode}>#DE1DE9</div>
                            <div className={styles.colorLastPrice}>
                                <b>$1295.69</b>
                            </div>
                            <div className={styles.colorETH}>
                                <img src={"/images/uparrow.png"} alt="Sold" />
                                +2.5%
                            </div>
                            <div className={styles.colorBuyer}>morgan.eth</div>
                            <div className={styles.colorSeller}>0x87aa...ba42</div>
                            <div className={styles.colorDate}>2.22.2022 12:15 GMT</div>
                            <div className={styles.colorTx}>
                                <img src={"/images/arrow.png"} alt="Sold" />
                            </div>
                        </div>
                        <div className={styles.CollectionTableBody}>
                            <div className={styles.colorBox}>
                                <div
                                    className={styles.box}
                                    style={{ background: "#FAEBD7" }}
                                ></div>
                            </div>
                            <div className={styles.colorName}>milk tooth</div>
                            <div className={styles.colorCode}>#FEBD7</div>
                            <div className={styles.colorLastPrice}>
                                <b>$708.21</b>
                            </div>
                            <div className={styles.colorETH}>
                                <img src={"/images/uparrow.png"} alt="Sold" />
                                +2.5%
                            </div>
                            <div className={styles.colorBuyer}>morgan.eth</div>
                            <div className={styles.colorSeller}>0x87aa...ba42</div>
                            <div className={styles.colorDate}>2.22.2022 12:14 GMT</div>
                            <div className={styles.colorTx}>
                                <img src={"/images/arrow.png"} alt="Sold" />
                            </div>
                        </div>
                        <div className={styles.CollectionTableBody}>
                            <div className={styles.colorBox}>
                                <div
                                    className={styles.box}
                                    style={{ background: "#D20000" }}
                                ></div>
                            </div>
                            <div className={styles.colorName}>Kout Rogue</div>
                            <div className={styles.colorCode}>#D20000</div>
                            <div className={styles.colorLastPrice}>
                                <b>$1249.73</b>
                            </div>
                            <div className={styles.colorETH}>
                                <img src={"/images/uparrow.png"} alt="Sold" />
                                +2.5%
                            </div>
                            <div className={styles.colorBuyer}>morgan.eth</div>
                            <div className={styles.colorSeller}>0x87aa...ba42</div>
                            <div className={styles.colorDate}>2.22.2022 12:13 GMT</div>
                            <div className={styles.colorTx}>
                                <img src={"/images/arrow.png"} alt="Sold" />
                            </div>
                        </div>
                        <div className={styles.CollectionTableBody}>
                            <div className={styles.colorBox}>
                                <div
                                    className={styles.box}
                                    style={{ background: "#D20000" }}
                                ></div>
                            </div>
                            <div className={styles.colorName}>LUCID DREAM</div>
                            <div className={styles.colorCode}>#D20000</div>
                            <div className={styles.colorLastPrice}>
                                <b>$781.08</b>
                            </div>
                            <div className={styles.colorETH}>
                                <img src={"/images/uparrow.png"} alt="Sold" />
                                +2.5%
                            </div>
                            <div className={styles.colorBuyer}>morgan.eth</div>
                            <div className={styles.colorSeller}>0x87aa...ba42</div>
                            <div className={styles.colorDate}>2.22.2022 12:11 GMT</div>
                            <div className={styles.colorTx}>
                                <img src={"/images/arrow.png"} alt="Sold" />
                            </div>
                        </div>
                        <div className={styles.CollectionTableBody}>
                            <div className={styles.colorBox}>
                                <div
                                    className={styles.box}
                                    style={{ background: "#00FF00" }}
                                ></div>
                            </div>
                            <div className={styles.colorName}>RGB Green</div>
                            <div className={styles.colorCode}>#00FF00</div>
                            <div className={styles.colorLastPrice}>
                                <b>$777.92</b>
                            </div>
                            <div className={styles.colorETH}>
                                <img src={"/images/uparrow.png"} alt="Sold" />
                                +2.5%
                            </div>
                            <div className={styles.colorBuyer}>morgan.eth</div>
                            <div className={styles.colorSeller}>0x87aa...ba42</div>
                            <div className={styles.colorDate}>2.22.2022 12:10 GMT</div>
                            <div className={styles.colorTx}>
                                <img src={"/images/arrow.png"} alt="Sold" />
                            </div>
                        </div>
                    </div>
                    {/* <div className={styles.flexSecondContainer}>
                        <h2><b>511</b> Colors</h2>
                    </div> */}
                </article>
            </div>
        </section>
    );
};

export default RecentTrades;

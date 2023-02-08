import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/modules/profile/setting.module.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Switch from "react-switch";
import { useSelector } from "react-redux";

const Setting = ({ data }) => {
    const connectedAddress = '0X654Esdgsdfdh790B90';
    const [darkMode, setDarkMode] = useState(true);

    const [switchList, setSwitchList] = useState({
        action: false,
        buynow: false,
        offer: false,
    });

    return (
        <>
            <section className={styles.wrapper}>
                <div className={styles.profileTab}>
                    <Tabs className={styles.reactTabs}>
                        <div className={styles.leftTab}>
                            <div className={styles.settingMenu}>
                                <h1>Settings</h1>
                                <TabList className={styles.tabList}>
                                    <Tab className={styles.tabsTab} selectedClassName={styles.tabsTab_selected}>
                                        <p>Profile</p>
                                    </Tab>
                                    <Tab className={styles.tabsTab} selectedClassName={styles.tabsTab_selected}>
                                        <p>Notifications</p>
                                    </Tab>
                                </TabList>
                            </div>
                            <div className={styles.darkMode}>
                                <div className={styles.lightImage}>
                                    <img src={"/images/icon/light-image.png"} alt="" />
                                </div>
                                <span>Dark Mode</span>
                                <div className={styles.switchItem}>
                                    <Switch
                                        checked={darkMode}
                                        onChange={() => setDarkMode(!darkMode)}
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
                                </div>
                            </div>
                        </div>

                        <div className={styles.rightTab}>
                            <TabPanel className={styles.tabsTab_panel} selectedClassName={styles.tabsTab_panel_selected}>
                                <div className={styles.panelContent}>
                                    <div className={styles.profileWallet}>
                                        <div className={styles.profileTitle}>
                                            <h2>My Wallet</h2>
                                        </div>
                                        <div className={styles.profileBGContent}>
                                            <h6>Balance</h6>
                                            <div className={styles.profileFlexContent}>
                                                <div className={styles.leftWallet}>
                                                    0 ETH
                                                </div>
                                                <div className={styles.rightWallet}>
                                                    <div className={styles.connectToken}>
                                                        {connectedAddress.substring(0, 6)}...
                                                        {connectedAddress.substring(connectedAddress.length - 6)}
                                                        <div className={styles.greenConnected} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.profileTitle}>
                                            <h2>My Wallet</h2>
                                        </div>
                                        <div className={styles.profileImage}>
                                            <div className={styles.Image}>
                                                <img src={"/images/boredApe.png"} alt="" />
                                            </div>
                                            <div className={styles.changeImage}>
                                                <p>We recommend an image<br /> of at least 300x300. <br />Max 5mb.</p>
                                                <button className={styles.white_border_button}>
                                                    change photo
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.profileFrom}>
                                            <div className={styles.fromList}>
                                                <label>Username</label>
                                                <input placeholder="Enter your Username" type="text" value={'thesarahshow'} />
                                            </div>
                                            <div className={styles.fromList}>
                                                <label>Full Name</label>
                                                <input placeholder="Enter your Full Name" type="text" value={'Lazar Glumac'} />
                                            </div>
                                            <div className={styles.fromList}>
                                                <label>Email</label>
                                                <input placeholder="Enter your Email" type="text" value={'thesarahshow@gmail.com'} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel className={styles.tabsTab_panel} selectedClassName={styles.tabsTab_panel_selected}>
                                <div className={styles.panelContent}>
                                    <div className={styles.profileNotification}>
                                        <div className={styles.profileTitle}>
                                            <h2>Notifications</h2>
                                        </div>
                                        <div className={styles.profileBGContent}>
                                            <h6>Auction</h6>
                                            <div className={styles.profileFlexContent}>
                                                <div className={styles.switchItem}>
                                                    <label className={styles.switchLabel} htmlFor="small-radius-switch">
                                                        <p>Receive email notifications when bids you place are confirmed, when you have been outbid, and when an auction has ended.</p>
                                                        <Switch
                                                            checked={switchList.action}
                                                            onChange={() =>
                                                                setSwitchList({
                                                                    ...switchList,
                                                                    action: !switchList.action,
                                                                })
                                                            }
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
                                            </div>
                                        </div>
                                        <div className={styles.profileBGContent}>
                                            <h6>Buy Now </h6>
                                            <div className={styles.profileFlexContent}>
                                                <div className={styles.switchItem}>
                                                    <label className={styles.switchLabel} htmlFor="small-radius-switch">
                                                        <p>Receive email notifications when someone buys your FT and when you buy an NFT via Buy Now.</p>
                                                        <Switch
                                                            checked={switchList.buynow}
                                                            onChange={() =>
                                                                setSwitchList({
                                                                    ...switchList,
                                                                    buynow: !switchList.buynow,
                                                                })
                                                            }
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
                                            </div>
                                        </div>
                                        <div className={styles.profileBGContent}>
                                            <h6>Offer</h6>
                                            <div className={styles.profileFlexContent}>
                                                <div className={styles.switchItem}>
                                                    <label className={styles.switchLabel} htmlFor="small-radius-switch">
                                                        <p>Receive email notifications when someone buys your FT and when you buy an NFT via Buy Now.</p>
                                                        <Switch
                                                            checked={switchList.offer}
                                                            onChange={() =>
                                                                setSwitchList({
                                                                    ...switchList,
                                                                    offer: !switchList.offer,
                                                                })
                                                            }
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </div>
                    </Tabs>
                </div>
            </section>
        </>
    );
};

export default Setting;

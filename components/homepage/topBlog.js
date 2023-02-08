import React from "react";
import TextLoop from "react-text-loop/lib/components/TextLoop";
import styles from "../../styles/modules/homepage/firstSection.module.css";
// import viceLogo from "../../images/viceLogo.png";
// import TAXI from "../../images/logos/TAXI.png"

const TopBlog = () => {
    return (
        <section className={styles.TopBlog}>
            <TextLoop interval={5000} springConfig={{ stiffness: 200, damping: 5 }}>
                <a
                    className='vice_container'
                    target='_blank'
                    rel='noreferrer'
                    href='https://www.vice.com/en/article/3ab5k8/can-you-own-a-color-a-new-nft-marketplace-is-trying-to-find-out?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum'
                >
                    <img src={'/images/viceLogo.png'} alt='vice logo' />
                    <h1>CAN YOU OWN COLORS?</h1>
                    <div className={styles.btn}>Read</div>
                </a>
                <a
                    className='vice_container'
                    target='_blank'
                    rel='noreferrer'
                    href='https://designtaxi.com/news/417628/NFT-Color-Museum-Claims-You-Can-Own-Hues-Gain-Royalties-From-Them/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum'
                >
                    <img src={'/images/logos/TAXI.png'} alt='taxi logo' />
                    <h1>OWN HUES & GAIN ROYALTIES?</h1>
                    <div className={styles.btn}>Read</div>
                </a>
            </TextLoop>
        </section>
    )
}

export default TopBlog
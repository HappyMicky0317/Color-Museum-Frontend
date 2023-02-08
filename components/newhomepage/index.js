import React from "react";
import styles from "../../styles/modules/newhomepage/newhomepage.module.css";
import FirstSection from "./FirstSection";
 

const index = () => {
    return (
        <div className={styles.container}>
            <FirstSection />  
        </div>
    );
};

export default index;

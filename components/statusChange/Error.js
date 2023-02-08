import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ErrorOff, MessageObj } from "../../store/actions/updateMint";
import styles from "../../styles/modules/statusChange/statusChange.module.css";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

const Error = () => {
  const { messageObj } = useSelector((state) => state.updateMint);
  const dispatch = useDispatch();
  const [animation, setAnimation] = useState(true);

  // animation && toast.error(
  //   (t) => (
  //     <div
  //       className={`${t.visible ? 'animate-enter' : 'animate-leave'}${styles.toastSuccessDiv}`}
  //     >
  //       <div className={styles.toastCenterPart}>
  //         <b className={styles.toastTextBold}>
  //           {messageObj.heading}
  //         </b>
  //         <p>
  //           {messageObj.text}
  //         </p>
  //       </div>
  //       <span className={styles.toastButtonClose} onClick={() => toast.dismiss(t.id)}>
  //         &times;
  //       </span>
  //     </div>
  //   ),
  //   {
  //     duration: 1000,
  //     position: 'top-right',
  //     className: 'sucess',
  //     top: '200px',
  //     style: {
  //       border: '0px solid #713200',
  //       padding: '16px',
  //       color: '#713200',
  //       padding: '15px 30px 15px 15px',
  //     },
  //   });

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(ErrorOff());
      setAnimation(false);
      dispatch(
        MessageObj({
          heading: "",
          text: "",
        })
      );
    }, 5000);
    return () => clearTimeout(timeout);
  }, [animation]);



  return (
    <>
      {animation ? (
        <>
          {/* <Toaster /> */}
          {/* <div className={styles.popup_container}>
            <h1>
              {messageObj.heading && messageObj.heading !== ""
                ? messageObj.heading
                : "Error"}
            </h1>
            <p>
              {messageObj.text && messageObj.text !== ""
                ? messageObj.text
                : "Action not verified"}
            </p>
          </div> */}

          {messageObj.text && messageObj.text !== "" ?
            null
            :
            toast((t) => (
              <div className={styles.toastComman}>
                Action not verified
                <IoCloseSharp
                  size={25}
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                />
              </div>
            ),
              {
                position: "top-right"
              }
            )
          }
        </>
      ) : null}
    </>
  );
};

export default Error;

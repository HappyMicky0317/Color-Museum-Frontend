import { useDispatch, useSelector } from "react-redux";
import { MessageObj, SuccessOff } from "../../store/actions/updateMint";
import styles from "../../styles/modules/statusChange/statusChange.module.css";

const Success = () => {
  const { messageObj } = useSelector((state) => state.updateMint);
  const dispatch = useDispatch();
  const [animation, setAnimation] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(SuccessOff());
      setAnimation(false);
      dispatch(
        MessageObj({
          heading: "",
          text: "",
        })
      );
    }, 2000);
    return () => clearTimeout(timeout);
  }, [animation]);
  return (
    <>
      {animation ? (
        <div className={styles.popup_container}>
          <h1>
            {messageObj.heading && messageObj.heading !== ""
              ? messageObj.heading
              : "Success"}
          </h1>
          <p>
            {messageObj.text && messageObj.text !== ""
              ? messageObj.text
              : "Action verified"}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default Success;

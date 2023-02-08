import { useRouter } from "next/router";
import { useEffect } from "react";
import Loader from "../Loader/Loader";
import { app, credentials } from "../../utils/realm-app";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import stylesNav from "../../styles/modules/nav.module.css";
import { IoCloseSharp } from "react-icons/io5";

const Verify = () => {
  const history = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const emailVerificationCode = query.get("verificationCode")
      ? query.get("verificationCode")
      : "";
    const asyncFunc = async () => {
      try {
        const user = await app.logIn(credentials);
        const response = await user.functions.verify_email({
          emailVerificationCode,
        });
        if (!response.error && response.isVerified) {
          toast((t) => (
            <div className={stylesNav.toastComman}>
              You are on the waitlist.
              <IoCloseSharp
                size={25}
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              />
            </div>
          ));
          history.push("/choose");
        } else history.push("/referralError");
      } catch (error) {
        console.log(error);
      }
    };
    asyncFunc();
    // eslint-disable-next-line
  }, []);
  return (
    <article className="verify_loader">
      <Loader />
    </article>
  );
};

export default Verify;

import stylesChoose from "../../styles/modules/choose/choose.module.css";
import stylesName from "../../styles/modules/name/name.module.css";
import styles from "../../styles/modules/describe/describe.module.css";
import Typed from "react-typed";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ColorMintedOff,
  DescriptionChange,
  VioletedOff,
  WarningOff,
} from "../../store/actions/toggle";
import { BACKEND, NEXT_PUBLIC_OPENAI_API_KEY } from "../../utils/constants";
import { useRouter } from "next/router";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import PuffLoader from "react-spinners/PuffLoader";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";
import stylesNav from "../../styles/modules/nav.module.css";

const { Configuration, OpenAIApi } = require("openai");

const Describe = () => {
  const { choosenColorFinal, choosenNameFinal, choosenDescriptionFinal } =
    useSelector((state) => state.minting);
  const dispatch = useDispatch();

  const [fontSizeAmount, setFontSizeAmount] = useState("32");
  const [fontSizeAmountMobile, setFontSizeAmountMobile] = useState("22");
  useEffect(() => {
    if (choosenNameFinal.length < 20) {
      setFontSizeAmount("32");
      setFontSizeAmountMobile("22");
    } else {
      setFontSizeAmount("26");
      setFontSizeAmountMobile("17");
    }
  }, [choosenNameFinal]);
  //
  //
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(ColorMintedOff());
    dispatch(VioletedOff());
    dispatch(WarningOff());
    if (!choosenDescriptionFinal) {
      toast((t) => (
        <div className={stylesNav.toastComman}>
          Describe your color to continue.
          <IoCloseSharp
            size={25}
            onClick={() => {
              toast.dismiss(t.id);
            }}
          />
        </div>
      ));
      e.preventDefault();
    } else {
      const profanity_result = await axios.get(
        `${BACKEND}/api/v1/image/clean-check/${choosenDescriptionFinal}`
      );
      if (profanity_result.data.isClean) {
        dispatch(WarningOff());
        router.push("/mint");
        e.preventDefault();
        localStorage.setItem(
          "choosenColor",
          `color: ${choosenColorFinal}, name: ${choosenNameFinal}, description: ${choosenDescriptionFinal}`
        );
      } else {
        toast((t) => (
          <div className={stylesNav.toastComman}>
            Sorry, profanity is not tolerated. Be more creative.
            <IoCloseSharp
              size={25}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        ));
      }
    }
  };
  //
  //
  const configuration = new Configuration({
    apiKey: NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const [setLoader, setSetLoader] = useState({
    haiku: false,
    description: false,
    essay: false,
    poem: false,
  });
  const fetchDescribe = async (code) => {
    setSetLoader({
      haiku: code === "haiku" ? true : false,
      description: code === "description" ? true : false,
      essay: code === "essay" ? true : false,
      poem: code === "poem" ? true : false,
    });
    const response = await openai.createCompletion("text-davinci-001", {
      prompt: `Write a ${code} for a color named ${choosenNameFinal} with the hexadecimal ${choosenColorFinal}`,
      temperature: 0.7,
      // 1 => Max tokes of 250
      max_tokens: 250,
      frequency_penalty: 0,
      presence_penalty: 0,
      // 3 => Unique User Id
      user: uuidv4(),
    });

    if (response.data.choices[0].text) {
      setSetLoader({
        haiku: false,
        description: false,
        essay: false,
        poem: false,
      });
    }
    // 2 => OpenAI content filter
    const filteredResponse = await openai.createCompletion(
      "content-filter-alpha",
      {
        prompt:
          "<|endoftext|>" + response.data.choices[0].text + "\n--\nLabel:",
        temperature: 0,
        max_tokens: 1,
        top_p: 0,
        logprobs: 10,
        // 3 => Unique User Id
        user: uuidv4(),
      }
    );

    if (
      filteredResponse.data.choices[0].text === "0" ||
      filteredResponse.data.choices[0].text === "1"
    ) {
      dispatch(DescriptionChange(response.data.choices[0].text));
    } else {
      dispatch(DescriptionChange("This content is unsafe to display!"));
    }
  };
  return (
    <>
      <article
        className={stylesName.text_container}
        style={{ minHeight: "60vh" }}
      >
        <div style={{ paddingBottom: "2rem" }}>
          <h1 className={stylesChoose.header}>Describe your color</h1>
          <p className={stylesChoose.description}>
            Tell us the essence of your color, write a poem, song or parable.
            Let it be known what your color means.
          </p>
          <div
            className={stylesName.mobile_picker}
            style={{
              backgroundColor: `${choosenColorFinal}`,
            }}
          >
            <div className={stylesName.hexidecimal_mobile}>
              <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
                {choosenNameFinal}
              </p>
              <p
                style={{
                  fontSize: `${fontSizeAmountMobile}px`,
                  textAlign: "right",
                }}
              >
                {choosenColorFinal}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className={stylesName.type_input}
              value={choosenDescriptionFinal}
              onChange={(e) => {
                dispatch(DescriptionChange(e.target.value));
              }}
              placeholder="Type it here"
              type="text"
              maxLength="500"
              cols="0"
              rows="0"
            ></input>
            <p className={styles.desc}>{choosenDescriptionFinal}</p>
            <div className={stylesName.flex}>
              <button
                className={`${styles.button} ${styles.description_btn}`}
                type="submit"
                style={{ margin: "0", justifyContent: "center" }}
              >
                Use this description
              </button>
              <p className={stylesName.maximum}>500 character maximum</p>
            </div>
          </form>

          <button
            className={styles.button}
            type="button"
            onClick={() => fetchDescribe("haiku")}
          >
            {setLoader.haiku ? (
              <PuffLoader
                className={styles.BtnPuffLoader}
                color="#000"
                size={25}
              />
            ) : (
              <img src={"/images/openAi.png"} alt="open ai logo" />
            )}
            Write a haiku
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => fetchDescribe("description")}
          >
            {setLoader.description ? (
              <PuffLoader
                className={styles.BtnPuffLoader}
                color="#000"
                size={25}
              />
            ) : (
              <img src={"/images/openAi.png"} alt="open ai logo" />
            )}
            Write a description
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => fetchDescribe("essay")}
          >
            {setLoader.essay ? (
              <PuffLoader
                className={styles.BtnPuffLoader}
                color="#000"
                size={25}
              />
            ) : (
              <img src={"/images/openAi.png"} alt="open ai logo" />
            )}
            Write an essay
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => fetchDescribe("poem")}
          >
            {setLoader.poem ? (
              <PuffLoader
                className={styles.BtnPuffLoader}
                color="#000"
                size={25}
              />
            ) : (
              <img src={"/images/openAi.png"} alt="open ai logo" />
            )}
            Write a poem
          </button>
        </div>
      </article>
      <div className={styles.describeText}>
        <Typed
          strings={[choosenDescriptionFinal]}
          typeSpeed={50}
          loop={true}
          backSpeed={50}
        />
      </div>
      <div
        className={stylesChoose.color}
        style={{ backgroundColor: `${choosenColorFinal}` }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenNameFinal}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenColorFinal}</p>
        </div>
      </div>
      <div className={stylesChoose.lineSide} />
    </>
  );
};

export default Describe;

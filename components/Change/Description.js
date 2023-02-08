import { Configuration, OpenAIApi } from "openai";
import { useEffect, useState } from "react";
import Typed from "react-typed";
import { v4 as uuidv4 } from "uuid";
import stylesChoose from "../../styles/modules/choose/choose.module.css";
import stylesName from "../../styles/modules/name/name.module.css";
import styles from "../../styles/modules/describe/describe.module.css";
import PuffLoader from "react-spinners/PuffLoader";


const Description = ({
  receivedColorName,
  receivedColor,
  receivedColorNameDesc,
  setReceivedColorDesc,
  setDescription,
  setSign,
}) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("32");
  const [fontSizeAmountMobile, setFontSizeAmountMobile] = useState("22");
  useEffect(() => {
    if (receivedColorName.length < 20) {
      setFontSizeAmount("32");
      setFontSizeAmountMobile("22");
    } else {
      setFontSizeAmount("26");
      setFontSizeAmountMobile("17");
    }
  }, [receivedColorName]);
  //
  //
  const [inputDescription, setInputtDescription] = useState(
    receivedColorNameDesc
  );
  const [setLoader, setSetLoader] = useState(
    {
      haiku: false,
      description: false,
      essay: false,
      poem: false
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    setReceivedColorDesc(inputDescription);
    setDescription(false);
    setSign(true);
  };
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const fetchDescribe = async (code) => {
    setSetLoader({
      haiku: code === 'haiku' && true,
      description: code === 'description' && true,
      essay: code === 'essay' && true,
      poem: code === 'poem' && true
    })

    const response = await openai.createCompletion("text-davinci-001", {
      prompt: `Write a ${code} for a color named ${receivedColorName} with the hexadecimal ${receivedColor}`,
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
        poem: false
      })
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
      setInputtDescription(response.data.choices[0].text);
    } else {
      setInputtDescription("This content is unsafe to display!");
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
              backgroundColor: `${receivedColor}`,
            }}
          >
            <div className={stylesName.hexidecimal_mobile}>
              <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
                {receivedColorName}
              </p>
              <p style={{ fontSize: `${fontSizeAmountMobile}px` , textAlign: 'right' }}>
                {receivedColor}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              className={stylesName.type_input}
              value={inputDescription}
              onChange={(e) => {
                dispatch(DescriptionChange(e.target.value));
              }}
              placeholder="Type it here"
              type="text"
              maxLength="500"
              cols="0"
              rows="0"
            ></input>
            <p className={styles.desc}>{inputDescription}</p>
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
            {setLoader.haiku ?
              <PuffLoader className={styles.BtnPuffLoader} color="#000" size={25} />
              :
              <img src={"/images/openAi.png"} alt="open ai logo" />
            }
            Write a haiku
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => fetchDescribe("description")}
          >
            {setLoader.description ?
              <PuffLoader className={styles.BtnPuffLoader} color="#000" size={25} />
              :
              <img src={"/images/openAi.png"} alt="open ai logo" />
            }
            Write a description
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => fetchDescribe("essay")}
          >
            {setLoader.essay ?
              <PuffLoader className={styles.BtnPuffLoader} color="#000" size={25} />
              :
              <img src={"/images/openAi.png"} alt="open ai logo" />
            }
            Write an essay
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => fetchDescribe("poem")}
          >
            {setLoader.poem ?
              <PuffLoader className={styles.BtnPuffLoader} color="#000" size={25} />
              :
              <img src={"/images/openAi.png"} alt="open ai logo" />
            }
            Write a poem
          </button>
        </div>
      </article>
      <div className={styles.describeText}>
        <Typed
          strings={[inputDescription]}
          typeSpeed={50}
          loop={true}
          backSpeed={50}
        />
      </div>
      <div
        className={stylesChoose.color}
        style={{ backgroundColor: `${receivedColor}` }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{receivedColorName}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{receivedColor}</p>
        </div>
      </div>
      <div className={stylesChoose.lineSide} />
    </>
  );
};

export default Description;

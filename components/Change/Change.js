import React, { useEffect, useState } from "react";
import Header from "./Header";
import Name from "./Name";
import Description from "./Description";
import Sign from "./Sign";
import { useRouter } from "next/router";
import axios from "axios";
import { BACKEND } from "../../utils/constants";
import { useSelector } from "react-redux";
import Success from "../statusChange/Success";
import Error from "../statusChange/Error";

const Change = () => {
  const { query } = useRouter();
  const { id } = query;
  const [name, setName] = useState(true);
  const [description, setDescription] = useState(false);
  const [sign, setSign] = useState(false);
  const [receivedColor, setReceivedColor] = useState("");
  const [receivedColorName, setReceivedColorName] = useState("");
  const [receivedColorNameDesc, setReceivedColorDesc] = useState("");
  //
  //
  const { success, error } = useSelector((state) => state.updateMint);
  const router = useRouter();
  useEffect(() => {
    console.log(id);
    if (id) {
      const handleData = async () => {
        await axios(`${BACKEND}/api/v1/image/get-image/${id}`)
          .then((res) => {
            setReceivedColorName(res.data.name);
            setReceivedColor(res.data.hex);
            setReceivedColorDesc(res.data.description);
          })
          .catch((error) => {
            console.log(error);
            router.push("/gallery");
          });
      };
      handleData();
    }
  }, [id]);
  return (
    <>
      {success ? <Success /> : null}
      {error ? <Error /> : null}
      <Header
        name={name}
        description={description}
        sign={sign}
        setName={setName}
        setDescription={setDescription}
        setSign={setSign}
      />
      {name ? (
        <Name
          receivedColor={receivedColor}
          receivedColorName={receivedColorName}
          setReceivedColorName={setReceivedColorName}
          setDescription={setDescription}
          setName={setName}
        />
      ) : description ? (
        <Description
          receivedColor={receivedColor}
          receivedColorName={receivedColorName}
          receivedColorNameDesc={receivedColorNameDesc}
          setReceivedColorDesc={setReceivedColorDesc}
          setDescription={setDescription}
          setSign={setSign}
        />
      ) : sign ? (
        <Sign
          receivedColor={receivedColor}
          receivedColorName={receivedColorName}
          receivedColorNameDesc={receivedColorNameDesc}
          tokenId={id}
        />
      ) : null}
    </>
  );
};

export default Change;

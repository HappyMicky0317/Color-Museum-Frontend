import Head from "next/head";
import React, { useState } from "react";
import TokenIDComponent from "../../../components/newTokenID/TokenId";
import MagicLinkLoginComponent from "../../../components/newTokenID/MagicLinkLoginComponent";

const TokenID = ({ data }) => {
  const [number, setNumber] = useState(data.nftNo);
  const [name, setName] = useState(data.name);
  const [color, setColor] = useState(data.hex);
  const [description, setDescription] = useState(
    data.description || "Description"
  );
  const [loginOpen, setLoginOpen] = useState(true);
  const [image, setImage] = useState(data.image);
  const toggleLogin = () => {
    setLoginOpen(!loginOpen);
  }
  return (
    <>
      <Head>
        <title>{`Color NFT No. ${number} | ${name} | ${color}`}</title>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="%PUBLIC_URL%/favicon.ico"
        />
        <meta
          name="title"
          content={`Color NFT No.${number} | ${name} | ${color}`}
        />
        <meta name="description" content={description} />
        <meta property="og:image" content={image} />
        <meta
          property="og:title"
          content={`Color NFT No.${number} | ${name} | ${color}`}
        />
        <meta property="og:description" content={description} />
        <meta
          property="twitter:title"
          content={`Color NFT No.${number} | ${name} | ${color}`}
        />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />
      </Head>
      <TokenIDComponent data={data} />
      <MagicLinkLoginComponent createAndLoginAccount={loginOpen} loginOpen={toggleLogin}></MagicLinkLoginComponent>
    </>
  );
};

export default TokenID;

export async function getServerSideProps({ params }) {
  // Fetch data from external API
  const res = await fetch(
    `https://metadata.color.museum/api/v1/image/get-image/${params.token}`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

import Head from "next/head";
import React from "react";
import Verify from "../components/verify/Verify";

const verify = () => {
  return (
    <>
      <Head>
        <title>Verify</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Verify />
    </>
  );
};

export default verify;
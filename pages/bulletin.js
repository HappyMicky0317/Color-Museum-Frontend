import React from "react";
import client from "../client";
import groq from "groq";
import Head from "next/head";
import Bulletin from "../components/bulletin/Bulletin";

const bulletin = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Bulletin</title>
      </Head>
      <Bulletin posts={posts} />
    </>
  );
};

export async function getStaticProps() {
  const posts = await client.fetch(groq`
      *[_type == "post" && publishedAt < now()]|order(publishedAt desc)
    `);
  return {
    props: {
      posts,
    },
  };
}

export default bulletin;

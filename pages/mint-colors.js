import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MintColors from "../components/MintColors/MintColors";

const mintcolors = ({ data }) => {
  const router = useRouter();
  useEffect(() => {
    router.push("/choose");
  }, []);

  return (
    <>
      <Head>
        <title>Mint Concept</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MintColors data={data} />
    </>
  );
};

export default mintcolors;

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://metadata.color.museum/api/v1/image/`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const token = ({ data }) => {
  const router = useRouter();
  const {
    query: { token },
  } = router;
  useEffect(() => {
    router.push(`/gallery/color-nft/${token}`);
  }, []);

  return null;
};

export default token;

export async function getServerSideProps({ params }) {
  // Fetch data from external API
  const res = await fetch(
    `https://metadata.color.museum/api/v1/image/get-image/${params.token}`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/gallery/color-nft");
  }, []);
  return null;
};

export default index;

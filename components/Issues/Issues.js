import { useEffect } from "react";
import { useRouter } from "next/router";

const Issues = () => {
  const history = useRouter();

  useEffect(() => {
    window.location.href = "https://discord.com/invite/colormuseum";
    return () => {};
  }, [history]);
  return null;
};

export default Issues;

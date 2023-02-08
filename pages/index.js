import UiConcept from "../components/UiConcept/UiConcept";
import { useRouter } from "next/router";
import { FullWidthPage, HideHeaderLogo, Toggle } from "../store/actions/toggle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function Home({ data }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toggle } = useSelector((state) => state.toggle);

  useEffect(() => {
    router.pathname && dispatch(HideHeaderLogo()) && dispatch(FullWidthPage());
  }, []);


  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     dispatch(Toggle(window.scrollTop === 500 && false));
  //   });
  // }, []);


  return (
    <>
      <UiConcept data={data} />
    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://metadata.color.museum/api/v1/image/`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

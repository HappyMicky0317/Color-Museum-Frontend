import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../client";
import Head from "next/head";
import { Link } from "@mui/material";
import { GrFormNext } from "react-icons/gr";
import { format } from "date-fns";
import styles from "../../styles/modules/bulletin/post.module.css";
import stylesWrapper from "../../styles/modules/choose/choose.module.css";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

const Post = ({ post }) => {
  if (post !== undefined) {
    const { body, authors, categories, title, mainImage, publishedAt } = post;
    return (
      <>
        <Head>
          <title>{post.title}</title>
        </Head>
        <section
          className={stylesWrapper.wrapper}
          style={{ background: "#000", paddingTop: "33px" }}
        >
          <div className={styles.flexHeader}>
            <Link href="/" passHref>
              <a className={styles.headerLink}>Bulletin</a>
            </Link>
            <GrFormNext className={styles.grformnext} />
            <h2 className={styles.subheader}>
              {categories[0].title ? categories[0].title : "Press Release"}
            </h2>
          </div>
          <article className={styles.container}>
            <p className={styles.date}>
              {publishedAt ? format(new Date(publishedAt), "MM.dd.yy") : null}
            </p>
            <h1 className={styles.header}>{title ? title : "NFT Title"}</h1>
            {mainImage.asset ? (
              <>
                <img
                  className={styles.image}
                  src={urlFor(mainImage).fit("crop").auto("format").url()}
                  alt={mainImage.alt}
                />
                <h3 className={styles.secondHeader}>
                  {mainImage.alt ? mainImage.alt : null}
                </h3>
              </>
            ) : null}

            {body
              ? body.map((item, index) => {
                  if (item._type === "block") {
                    if (item.style === "normal") {
                      if (item.children.length === 1) {
                        if (item.markDefs[0]) {
                          return (
                            <div className={styles.description} key={index}>
                              {item.children[0].text
                                ? item.children[0].text
                                : null}
                            </div>
                          );
                        } else {
                          return (
                            <p className={styles.description} key={index}>
                              {item.children[0].text
                                ? item.children[0].text
                                : null}
                            </p>
                          );
                        }
                      } else if (item.children.length !== 1) {
                        if (item.markDefs[0]) {
                        }
                        return (
                          <div style={{ display: "flex" }} key={index}>
                            <p className={styles.description}>
                              {item.children.map((i, index) => {
                                if (i.marks[0] === "strong") {
                                  return (
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                      key={index}
                                    >
                                      {i.text}
                                    </span>
                                  );
                                } else if (
                                  item.markDefs[0] &&
                                  item.markDefs[0]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[0].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else if (
                                  item.markDefs[1] &&
                                  item.markDefs[1]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[1].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else if (
                                  item.markDefs[2] &&
                                  item.markDefs[2]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[2].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else if (
                                  item.markDefs[3] &&
                                  item.markDefs[3]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[3].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else if (
                                  item.markDefs[4] &&
                                  item.markDefs[4]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[4].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else if (
                                  item.markDefs[5] &&
                                  item.markDefs[5]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[5].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else if (
                                  item.markDefs[6] &&
                                  item.markDefs[6]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[6].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else if (
                                  item.markDefs[7] &&
                                  item.markDefs[7]._key === i.marks[0]
                                ) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.markDefs[7].href}
                                      key={index}
                                    >
                                      {i.text}
                                    </a>
                                  );
                                } else {
                                  return i.text;
                                }
                              })}
                            </p>
                          </div>
                        );
                      }
                    } else if (item.style === "h4") {
                      return (
                        <h4 className={styles.subtitleh4} key={index}>
                          {item.children[0].text ? item.children[0].text : null}
                        </h4>
                      );
                    }
                  } else if (item._type === "mainImage") {
                    if (item.alt.slice(0, 24) === "https://www.youtube.com/") {
                      return null;
                    }
                    return (
                      <img
                        className={styles.secondImage}
                        src={urlFor(item).fit("max").auto("format")}
                        alt={item.alt}
                        key={index}
                      />
                    );
                  }
                })
              : null}
            <div className={styles.flex + " " + styles.authorMainDiv}>
              <p className={styles.author_date}>
                {authors[0].author.name
                  ? authors[0].author.name
                  : "Author Name"}
              </p>
              <span className={styles.author_nickName}>
                {authors[0].author.name === "Omar Farooq" ? "curator" : null}
              </span>
            </div>
            <div className={styles.buttonContainer}>
              Join presale
              <a
                href={"https://color.museum/choose"}
                target="_blank"
                rel="noreferrer"
                className={styles.animatedButton}
              >
                Mint Now
              </a>
            </div>
          </article>
        </section>
      </>
    );
  } else {
    return null;
  }
};

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  authors,
  body,
  categories,
  mainImage,
  publishedAt,
  slug,
  title,
  _createdAt,
  _id,
  _updatedAt,
}`;
export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const post = await client.fetch(query, { slug });
  return {
    props: {
      post,
    },
  };
}
export default Post;

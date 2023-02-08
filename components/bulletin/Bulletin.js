import React, { useEffect, useState } from "react";
import { format, getMonth, parseISO } from "date-fns";
import Link from "next/link";
import { GrFormNext } from "react-icons/gr";
import styles from "../../styles/modules/bulletin/bulletin.module.css";

const Bulletin = (posts) => {
  const finalData = posts.posts.sort(function (a, b) {
    if (a.publishedAt.slice(0, 10) > b.publishedAt.slice(0, 10)) {
      return 1;
    }
    if (a.publishedAt.slice(0, 10) < b.publishedAt.slice(0, 10)) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  const [bulletin, setBulletin] = useState([]);
  useEffect(() => {
    if (finalData && Array.isArray(finalData) && finalData.length > 0) {
      const data = [];
      finalData.forEach((element) => {
        const { publishedAt } = element;
        const month = format(parseISO(publishedAt), "MMM");
        const monthNo = getMonth(new Date(publishedAt)) + 1;
        const index = data.findIndex((x) => {
          return x.month === month;
        });
        if (index > -1) {
          data[index].data = [...data[index].data, element];
        } else {
          data.push({
            month: month,
            monthNo,
            data: [element],
          });
        }
      });
      data.sort(sortMonth);
      console.log(data);
      setBulletin(data);
    }
    return () => {};
  }, []);

  const sortMonth = (a, b) => {
    return a.monthNo - b.monthNo;
  };

  return (
    <>
      <section className={styles.wrapper}>
        <article className={styles.containerblog}>
          <div className={styles.breadcrumb}>
            <Link href="/bulletin" passHref>
              <a className={styles.breadcrumbLink}>Home</a>
            </Link>
            <GrFormNext className={styles.grformnext} />
            <h3 className={styles.breadcrumbText}>Bulletin</h3>
          </div>
        </article>
        <div className={styles.mainPost}>
          {bulletin.length > 0 && (
            <>
              <h2 className={styles.postYear}>
                Q2 <span className={styles.small}>2022</span>
              </h2>
              <div className={styles.firstPostDiv}>
                <div className={styles.postMonth}>{bulletin[0].month}.</div>
                {bulletin[0].data.map((item, index) => {
                  return (
                    <Link href={`/post/${item.slug.current}`} key={index}>
                      <a className={styles.blogpostLink}>
                        <div className={styles.postGrid}>
                          <h1 className={styles.postTitle}>
                            {item.title ? item.title : "Title"}
                          </h1>
                          <p className={styles.postCategory}>
                            <span className={styles.postDate}>
                              {item.categories[0].title
                                ? item.categories[0].title
                                : "Category"}
                            </span>
                            <span className={styles.postDate}>
                              {item.publishedAt
                                ? format(parseISO(item.publishedAt), "do")
                                : "00"}
                            </span>
                          </p>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
          <h2 className={styles.postYear}>
            Q1 <span className={styles.small}>2022</span>
          </h2>
          <div className={styles.postRow}>
            {bulletin.map((item, index) => {
              if (index >= 0) {
                return (
                  <div>
                    <div className={styles.postMonth}>{item.month}.</div>
                    {item.data.map((item, idex) => {
                      return (
                        <Link href={`/post/${item.slug.current}`} key={index}>
                          <a className={styles.blogpostLink}>
                            <div className={styles.postGrid}>
                              <h1 className={styles.postTitle}>
                                {item.title ? item.title : "Title"}
                              </h1>
                              <p className={styles.postCategory}>
                                <span className={styles.postDate}>
                                  {item.categories[0].title
                                    ? item.categories[0].title
                                    : "Category"}
                                </span>
                                <span
                                  className={styles.postDate}
                                  style={{ textTransform: "uppercase" }}
                                >
                                  {item.publishedAt
                                    ? format(parseISO(item.publishedAt), "do")
                                    : "00"}
                                </span>
                              </p>
                            </div>
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Bulletin;

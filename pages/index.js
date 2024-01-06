import React from 'react';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css'
import List from '@/components/List'

export default function Home() {
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [data, setData] = useState(false);

  const fetchIssues = async (cursor) => {
    const queryParam = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
    const response = await fetch(`/api/issues${queryParam}`);
    const firstData = await response.json();
    setData(firstData)
  };

  useEffect(() => {
    fetchIssues(null); // Fetch initial set of issues
  }, []);

  useEffect(() => {
    const checkScrollBottom = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        console.log('Reached the bottom of the page');
        setIsOnBottom(true)
      } else {
        setIsOnBottom(false)
      }
    };

    window.addEventListener('scroll', checkScrollBottom);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', checkScrollBottom);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // For smooth scrolling
    });
  };

  return (
    <>
      <Head>
        <title>Github List</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1>HomeLike</h1>
          <h2>List of issues</h2>
          <p>Show list of issue from Reactjs repo:</p>
          <a href="https://github.com/reactjs/reactjs.org/issues" target="_blank">https://github.com/reactjs/reactjs.org/issues.</a>

          {data !== undefined ? <List data={data} /> : 'loading...'}

          {isOnBottom && <button onClick={scrollToTop} className={styles.top}>Scroll On Top</button>}
        </div>
      </main>
    </>
  )
}

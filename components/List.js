import React from 'react';
import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css'

export default function List({ data }) {
  const [issues, setIssues] = useState(); // initialIssues from getStaticProps
  const [currentCursor, setCurrentCursor] = useState();
  const [hasNext, setHasNext] = useState();
  const [hasPrev, setHasPrev] = useState(false);

  const [cursorHistory, setCursorHistory] = useState([]);

  useEffect(() => {
    if (data?.repository?.issues.edges) {

      setIssues(data.repository.issues.edges.map(edge => edge.node));
      setHasNext(true)

      setCurrentCursor(data?.repository?.issues.pageInfo.endCursor)
      setCursorHistory([data?.repository?.issues.pageInfo.endCursor]);
    }
  }, [data]);

  const fetchMoreIssues = async () => {
    const response = await fetch(`/api/issues?cursor=${encodeURIComponent(currentCursor)}`);
    const newIssues = await response.json();

    setIssues(newIssues.repository.issues.edges.map(edge => edge.node));
    setCurrentCursor(newIssues.repository.issues.pageInfo.endCursor);
    setHasNext(newIssues.repository.issues.pageInfo.hasNextPage);

    setCursorHistory(prevHistory => [...prevHistory, newIssues.repository?.issues.pageInfo.endCursor]);
    setHasPrev(true)
  };

  const fetchPreviousIssues = async () => {
    if(cursorHistory.length <= 2) {
        setHasPrev(false)
    } else {
        setHasPrev(true)
    }

    if (cursorHistory.length === 2) {
        setHasPrev(false)
        setIssues(data.repository.issues.edges.map(edge => edge.node));
        setCurrentCursor(data?.repository?.issues.pageInfo.endCursor)
        setCursorHistory(prevHistory => prevHistory.slice(0, -1));
    } else {
        const prevCursor = cursorHistory[cursorHistory.length - 3];
        const response = await fetch(`/api/issues?cursor=${encodeURIComponent(prevCursor)}`);
        const prevIssues = await response.json();

        setIssues(prevIssues.repository?.issues.edges.map(edge => edge.node));
        setCurrentCursor(prevIssues.repository?.issues.pageInfo.endCursor);
        setHasNext(prevIssues.repository?.issues.pageInfo.hasNextPage);

        setCursorHistory(prevHistory => prevHistory.slice(0, -1));
    }
  };

  return (
      <div>
        <ul className={styles.list}>
          {
            issues?.map((issue) => {
              return (
                  <li key={issue.number}>
                    <a href={`https://github.com/reactjs/react.dev/issues/${issue.number}`} target="_blank">{issue.title}</a>
                  </li>
              );
            })
          }
        </ul>
        <div className={styles.pagination}>
          <div className={styles.prev}><button disabled={!hasPrev} onClick={fetchPreviousIssues}>Previous</button></div>
          <div className={styles.next}><button disabled={!hasNext} onClick={fetchMoreIssues}>Next</button></div>
        </div>
      </div>
  )
}

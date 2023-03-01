import Head from 'next/head'
import { Input, List, Pagination } from 'antd';
import { useState, useEffect } from "react";
import styles from '@/styles/Home.module.css'

const PAGE_SIZE = 25;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const url = `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${PAGE_SIZE}&q=${searchTerm}`;
      console.log({url})
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    async function fetchUsers() {
      const url = `https://jsonplaceholder.typicode.com/users?q=${searchTerm}`;
      const response = await fetch(url);
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();
  }, [searchTerm]);

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value.toLowerCase());
  }

  const deletePost = async (id) => {
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log({data})
  }


  const filteredPosts = posts.filter((post) => {
    const user = users.find((user) => user.id === post.userId);
    return user && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <Input placeholder="Search by user name" value={searchTerm} onChange={handleSearchChange} />
          <List
            dataSource={filteredPosts}
            renderItem={(post) => {
              const user = users.find((user) => user.id === post.userId);
              if (!user) {
                return null;
              }
              return (
                <List.Item>
                  <List.Item.Meta title={post.title} description={post.body} />
                  <button onClick={() => deletePost(post.id)}>delete</button>
                  <div>{user.name} ({user.username}) { user.email}</div>
                </List.Item>
              );
            }}
          />
          <Pagination
            current={currentPage}
            total={100}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
          />
        </div>
      </main>
    </>
  )
}

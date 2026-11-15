import React from 'react';

// さくらのWordPressからGraphQLでデータを取得する関数
async function getWordPressPosts() {
  const endpoint = process.env.WORDPRESS_API_URL;
  
  if (!endpoint) {
    throw new Error('WORDPRESS_API_URL が設定されていません。.env.local を確認してください。');
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetPosts {
          posts {
            nodes {
              id
              title
              date
              uri
            }
          }
        }
      `,
    }),
    // 開発中にデータを即時反映させるための設定
    cache: 'no-store',
  });

  const { data } = await res.json();
  return data?.posts?.nodes || [];
}

// 画面を表示するメインのコンポーネント
export default async function Page() {
  const posts = await getWordPressPosts();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>さくらWP × Next.js ブログ</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>さくらのレンタルサーバのWordPressからWPGraphQL経由で取得した記事一覧です。</p>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post: any) => (
          <li key={post.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>
              {new Date(post.date).toLocaleDateString()}
            </span>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
              {post.title}
            </h2>
          </li>
        ))}
      </ul>
    </main>
  );
}
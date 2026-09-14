import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = '/api'

function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '123456' })
  const [search, setSearch] = useState('')
  const [newPost, setNewPost] = useState('')
  const [commentDrafts, setCommentDrafts] = useState({})

  useEffect(() => {
    fetchPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts

    return posts.filter((post) =>
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase()),
    )
  }, [posts, search])

  async function fetchPosts() {
    try {
      const response = await fetch(`${API_URL}/posts`)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Erro ao buscar posts', error)
    }
  }

  async function handleLogin(event) {
    event.preventDefault()

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })

    if (!response.ok) {
      alert('Credenciais inválidas')
      return
    }

    const data = await response.json()
    setUser(data.user)
  }

  async function handleCreatePost(event) {
    event.preventDefault()

    if (!user || !newPost.trim()) return

    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        content: newPost,
      }),
    })

    if (response.ok) {
      setNewPost('')
      fetchPosts()
    }
  }

  async function handleRating(postId, rating) {
    const response = await fetch(`${API_URL}/posts/${postId}/rating`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    })

    if (response.ok) {
      fetchPosts()
    }
  }

  async function handleComment(postId, parentId = null) {
    const draftKey = `${postId}-${parentId ?? 'root'}`
    const content = commentDrafts[draftKey]?.trim()

    if (!content || !user) return

    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: user.name,
        content,
        parentId,
      }),
    })

    if (response.ok) {
      setCommentDrafts((prev) => ({ ...prev, [draftKey]: '' }))
      fetchPosts()
    }
  }

  function renderComments(comments, postId, depth = 0) {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className="comment"
        style={{ marginLeft: depth > 0 ? `${depth * 18}px` : '0px' }}
      >
        <div className="comment-header">
          <strong>{comment.author}</strong>
        </div>
        <p>{comment.content}</p>

        {user && (
          <div className="reply-box">
            <input
              type="text"
              value={commentDrafts[`${postId}-${comment.id}`] || ''}
              onChange={(event) =>
                setCommentDrafts((prev) => ({
                  ...prev,
                  [`${postId}-${comment.id}`]: event.target.value,
                }))
              }
              placeholder="Responder ao comentário"
            />
            <button type="button" onClick={() => handleComment(postId, comment.id)}>
              Responder
            </button>
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Diatinf X</p>
          <h1>Rede social acadêmica</h1>
        </div>

        <div className="top-actions">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar publicações"
          />
          {user ? (
            <div className="user-pill">Olá, {user.name}</div>
          ) : (
            <button type="button" className="primary-btn" onClick={() => document.querySelector('.login-card')?.scrollIntoView({ behavior: 'smooth' })}>
              Entrar
            </button>
          )}
        </div>
      </header>

      <main className="content">
        <aside className="sidebar">
          {!user ? (
            <form className="login-card" onSubmit={handleLogin}>
              <h2>Login</h2>
              <label>
                Usuário
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, username: event.target.value }))
                  }
                />
              </label>
              <label>
                Senha
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </label>
              <button type="submit" className="primary-btn full">
                Entrar
              </button>
            </form>
          ) : (
            <div className="profile-card">
              <h2>Perfil</h2>
              <div className="profile-header">
                <div className="avatar">{user.name.charAt(0)}</div>
                <div>
                  <strong>{user.name}</strong>
                  <p>@{user.username}</p>
                </div>
              </div>
              <p>{user.bio}</p>
              <button type="button" className="secondary-btn full" onClick={() => setUser(null)}>
                Sair
              </button>
            </div>
          )}

          {user && (
            <form className="composer" onSubmit={handleCreatePost}>
              <h2>Nova publicação</h2>
              <textarea
                rows="4"
                value={newPost}
                onChange={(event) => setNewPost(event.target.value)}
                placeholder="Escreva sua publicação"
              />
              <button type="submit" className="primary-btn full">
                Publicar
              </button>
            </form>
          )}
        </aside>

        <section className="feed">
          {filteredPosts.length === 0 ? (
            <div className="empty-state">Nenhuma publicação encontrada.</div>
          ) : (
            filteredPosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <div>
                    <strong>{post.author}</strong>
                    <p>Publicação</p>
                  </div>
                  <span className="rating">{post.rating}/3 estrelas</span>
                </div>

                <p className="post-content">{post.content}</p>

                <div className="actions">
                  {[1, 2, 3].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={post.rating >= star ? 'star active' : 'star'}
                      onClick={() => handleRating(post.id, star)}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div className="comments-section">
                  <h3>Comentários</h3>
                  {renderComments(post.comments, post.id)}

                  {user && (
                    <div className="reply-box">
                      <input
                        type="text"
                        value={commentDrafts[`${post.id}-root`] || ''}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [`${post.id}-root`]: event.target.value,
                          }))
                        }
                        placeholder="Adicionar comentário"
                      />
                      <button type="button" onClick={() => handleComment(post.id)}>
                        Comentar
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App

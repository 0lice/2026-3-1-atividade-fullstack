const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    name: 'Administrador',
    bio: 'Aluno do curso Infoweb.',
  },
  {
    id: 2,
    username: 'maria',
    password: '123456',
    name: 'Maria Souza',
    bio: 'Apreciadora de tecnologia.',
  },
];

const posts = [
  {
    id: 1,
    userId: 1,
    author: 'Administrador',
    content: 'Olá, pessoal! Acabei de iniciar o projeto Diatinf X para a atividade da disciplina.',
    rating: 3,
    comments: [
      { id: 1, author: 'Maria Souza', content: 'Parabéns pelo começo!', parentId: null },
      {
        id: 2,
        author: 'Administrador',
        content: 'Obrigado! Vamos evoluir o app juntos.',
        parentId: 1,
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    author: 'Maria Souza',
    content: 'Hoje estou aprendendo mais sobre APIs REST e frontend com React.',
    rating: 2,
    comments: [],
  },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (item) => item.username === username && item.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
    },
  });
});

app.get('/api/users', (req, res) => {
  res.json(users.map(({ password, ...user }) => user));
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find((item) => item.id === Number(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post não encontrado' });
  }

  return res.json(post);
});

app.post('/api/posts', (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  const user = users.find((item) => item.id === Number(userId));
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    userId: Number(userId),
    author: user.name,
    content,
    rating: 0,
    comments: [],
  };

  posts.unshift(newPost);
  return res.status(201).json(newPost);
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { author, content, parentId } = req.body;
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).json({ message: 'Post não encontrado' });
  }

  const newComment = {
    id: Date.now(),
    author,
    content,
    parentId: parentId ? Number(parentId) : null,
  };

  post.comments.push(newComment);
  return res.status(201).json(newComment);
});

app.put('/api/posts/:id/rating', (req, res) => {
  const { rating } = req.body;
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).json({ message: 'Post não encontrado' });
  }

  const normalizedRating = Math.min(3, Math.max(1, Number(rating)));
  post.rating = normalizedRating;
  return res.json(post);
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

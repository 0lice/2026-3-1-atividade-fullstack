# 2026.3.1 - POS - Frontend web e Backend API RESTful

## Informações gerais

- **Público alvo**: alunos da disciplina de **Programação orientada a serviços** do curso de [Infoweb](https://diatinf.ifrn.edu.br/cursos/tecnico-em-informatica-para-internet/) na [DIATINF](https://diatinf.ifrn.edu.br/) no [CNAT-IFRN](https://portal.ifrn.edu.br/campus/natalcentral/)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)
- **Objetivo**:
  1. Atividade avaliativa para construção de um aplicativo com frontend web e backend API RESTful.

[A descrição da atividade](atividade.md)

---
## Relato da atividade

- **Nome do aluno**: Ana Alice da Costa Silva
- **GitHub**: [https://github.com/0lice](https://github.com/0lice)
- **LinkedIn**: [https://www.linkedin.com/in/ana-alice-ab7499342/](https://www.linkedin.com/in/ana-alice-ab7499342/)

### Componentes e tecnologias

- **Frontend**: React + Vite + JavaScript
- **Backend**: Node.js + Express
- **Comunicação**: Fetch API com proxy do Vite
- **Estilo**: Mobile first, responsivo e com paleta inspirada na identidade visual da DIATINF
- **Persistência**: dados em memória no backend para a atividade

### Agente de IA

Neste projeto, utilizei o GitHub Copilot como apoio para:

- estruturar o projeto fullstack;
- criar a interface inicial do frontend;
- sugerir a organização do código e do layout;
- acelerar a implementação do backend e das rotas da API;
- revisar e ajustar trechos do código para melhorar legibilidade e funcionalidade.

### Funcionalidades implementadas

- Login com usuário e senha
- Feed de publicações
- Pesquisa de publicações
- Criação de nova publicação
- Comentários e respostas encadeadas
- Avaliação de posts com 1 a 3 estrelas
- Perfil público do usuário
- Layout responsivo para mobile

### Execução do projeto

#### Requisitos

- Node.js 18+
- npm

#### Como executar

1. Abra um terminal na raiz do projeto:

   ```bash
   cd /workspaces/2026-3-1-atividade-fullstack
   ```

2. Inicie o frontend e o backend juntos:

   ```bash
   npm run dev
   ```

3. Acesse o frontend em:

   ```text
   http://localhost:5173
   ```

4. A API estará disponível em:

   ```text
   http://localhost:3001/api/health
   ```

#### Usuário de teste

- **Usuário**: admin
- **Senha**: 123456

### Vídeo do projeto em execução

- (./video/video_minora.mp4)

---

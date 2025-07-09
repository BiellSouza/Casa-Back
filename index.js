const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  "https://casa-front.vercel.app",
  // seu localhost pode ser adicionado se quiser:
  // "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições sem origin (curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: acesso negado para a origem ${origin}`;
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Casa Backend está funcionando!");
});

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: { excluido: false },
      orderBy: { criadoEm: "desc" },
    });
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
});

app.get("/produtos/lixeira", async (req, res) => {
  try {
    const produtosExcluidos = await prisma.produto.findMany({
      where: { excluido: true },
      orderBy: { criadoEm: "desc" },
    });
    res.json(produtosExcluidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar produtos excluídos" });
  }
});

app.post("/produtos", async (req, res) => {
  const { nome, descricao, imagem, categoria } = req.body;
  try {
    const produto = await prisma.produto.create({
      data: { nome, descricao, imagem, categoria, excluido: false },
    });
    res.status(201).json(produto);
  } catch (error) {
    console.error(error);
    res.status(400).json({ erro: "Erro ao criar produto" });
  }
});

app.put("/produtos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, descricao, imagem, categoria } = req.body;

  try {
    const produto = await prisma.produto.update({
      where: { id },
      data: { nome, descricao, imagem, categoria },
    });
    res.json(produto);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    res
      .status(400)
      .json({ erro: "Erro ao atualizar produto", detalhe: error.message });
  }
});

app.delete("/produtos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("ID recebido para exclusão:", id);

  try {
    const produto = await prisma.produto.update({
      where: { id },
      data: { excluido: true },
    });
    console.log("Produto marcado como excluído:", produto);
    res.json({ mensagem: "Produto excluído logicamente", produto });
  } catch (error) {
    console.error("Erro ao excluir produto:", error.message);
    res
      .status(400)
      .json({ erro: "Erro ao excluir produto", detalhe: error.message });
  }
});

app.put("/produtos/:id/restaurar", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const produto = await prisma.produto.update({
      where: { id },
      data: { excluido: false },
    });
    res.json({ mensagem: "Produto restaurado", produto });
  } catch (error) {
    console.error("Erro ao restaurar produto:", error.message);
    res
      .status(400)
      .json({ erro: "Erro ao restaurar produto", detalhe: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

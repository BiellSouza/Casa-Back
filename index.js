const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

// Configura CORS para liberar só o frontend da Vercel
app.use(
  cors({
    origin: "https://casa-front.vercel.app",
  })
);

app.use(express.json());

// Rota raiz para teste simples
app.get("/", (req, res) => {
  res.send("API Casa Backend está funcionando!");
});

// Listar produtos (somente os não excluídos por padrão)
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

// Listar produtos excluídos (lixeira)
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

// Criar produto
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

// Atualizar produto
app.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
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

// Excluir produto (exclusão lógica)
app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;
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

// Restaurar produto da lixeira
app.put("/produtos/:id/restaurar", async (req, res) => {
  const { id } = req.params;

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

// backend/index.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const { ObjectId } = require("mongodb");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
});

// Criar produto
app.post("/produtos", async (req, res) => {
  const { nome, descricao, imagem, categoria } = req.body;
  try {
    const produto = await prisma.produto.create({
      data: { nome, descricao, imagem, categoria },
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

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const existente = await prisma.produto.findUnique({ where: { id } });
    if (!existente) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const produto = await prisma.produto.update({
      where: { id },
      data: { nome, descricao, imagem, categoria },
    });
    res.json(produto);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    res.status(400).json({ erro: "Erro ao atualizar produto", detalhe: error.message });
  }
});

// Deletar produto
app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    await prisma.produto.delete({ where: { id } });
    res.json({ mensagem: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error.message);
    res.status(400).json({ erro: "Erro ao deletar produto", detalhe: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

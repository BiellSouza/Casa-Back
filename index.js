const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
});

app.post("/produtos", async (req, res) => {
  const { nome, descricao, imagem } = req.body;

  try {
    const produto = await prisma.produto.create({
      data: { nome, descricao, imagem },
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao criar produto" });
  }
});

app.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, imagem } = req.body;

  try {
    const produto = await prisma.produto.update({
      where: { id },
      data: { nome, descricao, imagem },
    });
    res.json(produto);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar produto" });
  }
});

app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.produto.delete({
      where: { id },
    });
    res.json({ mensagem: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar produto" });
  }
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});

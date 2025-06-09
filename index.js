const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/produtos", async (req, res) => {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
});

app.post("/produtos", async (req, res) => {
  const { nome, preco, descricao } = req.body;
  const produto = await prisma.produto.create({
    data: { nome, preco, descricao },
  });
  res.json(produto);
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});

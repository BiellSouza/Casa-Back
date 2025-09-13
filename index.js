const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  "https://casa-front.vercel.app",
  "http://localhost:5173", // se quiser localhost também
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy: acesso negado para a origem ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// app.use(express.json());
// Permitir payloads maiores (até 25MB)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Rota raiz de teste
app.get("/", (req, res) => {
  res.send("API Casa Backend está funcionando!");
});

// Listar todos produtos (sem filtro)
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { criadoEm: "desc" },
    });
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

// Excluir produto (exclusão física)
app.delete("/produtos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.produto.delete({
      where: { id },
    });
    res.json({ mensagem: "Produto excluído fisicamente" });
  } catch (error) {
    console.error("Erro ao excluir produto:", error.message);
    res
      .status(400)
      .json({ erro: "Erro ao excluir produto", detalhe: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir schema e model
const produtoSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  imagem: String,
  categoria: String,
  criadoEm: { type: Date, default: Date.now },
});

const Produto = mongoose.model("Produto", produtoSchema);

// Rotas
app.get("/", (req, res) => res.send("✅ API com mongoose online!"));

app.get("/produtos", async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

app.post("/produtos", async (req, res) => {
  const novoProduto = new Produto(req.body);
  const salvo = await novoProduto.save();
  res.status(201).json(salvo);
});

app.delete("/produtos/:id", async (req, res) => {
  await Produto.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Produto deletado" });
});

app.put("/produtos/:id", async (req, res) => {
  const atualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(atualizado);
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

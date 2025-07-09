// Remover import do ObjectId pois não é usado
// const { ObjectId } = require("mongodb");

app.put("/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, imagem, categoria } = req.body;

  const idNum = Number(id);
  if (isNaN(idNum)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const existente = await prisma.produto.findUnique({ where: { id: idNum } });
    if (!existente) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const produto = await prisma.produto.update({
      where: { id: idNum },
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
  const { id } = req.params;

  const idNum = Number(id);
  if (isNaN(idNum)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    await prisma.produto.delete({ where: { id: idNum } });
    res.json({ mensagem: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error.message);
    res
      .status(400)
      .json({ erro: "Erro ao deletar produto", detalhe: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

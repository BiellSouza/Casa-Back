require("dotenv").config();
const { MongoClient } = require("mongodb");

async function atualizarProdutosSemExcluido() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(); // se precisar, coloque o nome do seu DB aqui: client.db("nomeDoBanco")
    const produtos = db.collection("Produto"); // coleção padrão do Prisma é "Produto"

    const resultado = await produtos.updateMany(
      { excluido: { $exists: false } }, // filtro para documentos que NÃO têm campo excluido
      { $set: { excluido: false } } // seta excluido = false para esses documentos
    );

    console.log(`Produtos atualizados: ${resultado.modifiedCount}`);
  } catch (error) {
    console.error("Erro ao atualizar produtos antigos:", error);
  } finally {
    await client.close();
  }
}

atualizarProdutosSemExcluido();

//1. Importar los módulos NPM que necesito
const express = require("express");
const cors = require("cors");
//5. Conectar MySQL y ExpressJS
const mysql = require("mysql2/promise");

async function getConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    database: "online_store",
    user: "root",
    password: "Malina61!",
  });
  await connection.connect();

  console.log(
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`,
  );

  return connection;
}

//(buscar qué es- lo pondremos más tarde)
//const fs = require("fs");
//const path = require("path")

//2. Crear el servidor
const app = express();
// empezando ejercicio 4 - Añadir ejs
app.set("view engine", "ejs");

//3. Configurar el servidor
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//4. Arrancar el servidor en el puerto
const serverPort = 3000;
app.listen(serverPort, () => {
  console.log(`Server listening at http//:localhost:${serverPort}`);
});

/*app.get("/", function (req, res) {
  res.send("BIENVENIDA A MI NUEVA API!");
});*/

app.get("/products", async (req, res) => {
  const connection = await getConnection();
  const sql = `SELECT * FROM products`;
  const [results] = await connection.query(sql);
  res.json(results);
  connection.end();
});

app.get("/products/:id", async (req, res) => {
  const connection = await getConnection();
  const id = req.params.id;
  const sql = `SELECT * FROM products WHERE idproducts = ?`;
  const [results] = await connection.query(sql, [id]);
  res.json(results);
  connection.end();
});

app.post("/products", async (req, res) => {
  const connection = await getConnection();
  const { name, price, category, stock } = req.body;
  const sql = `INSERT INTO products (name, price, category, stock) VALUES (?,?,?,?)`;

  const [results] = await connection.query(sql, [name, price, category, stock]);

  connection.end();

  res.json({
    success: true,
    id: results.insertId,
  });
});
//Esto creo que no haace falta
app.delete("/products/:id", async (req, res) => {
  const connection = await getConnection();
  const id = req.params.id;
  const sql = "DELETE FROM products WHERE idproducts = ?";
  const [results] = await connection.query(sql, [id]);
  connection.end();
  res.json({
    success: true,
    affectedRows: results.affectedRows,
  });
});

app.put("/products/:id", async (req, res) => {
  const connection = await getConnection();

  const id = req.params.id;
  const { name, price, category, stock } = req.body;

  const sql = `
    UPDATE products 
    SET name = ?, price = ?, category = ?, stock = ?
    WHERE idproducts = ?
  `;

  const [results] = await connection.query(sql, [
    name,
    price,
    category,
    stock,
    id,
  ]);

  connection.end();

  res.json({
    success: true,
    affectedRows: results.affectedRows,
  });
});

app.get("/cart", async (req, res) => {
  const connection = await getConnection();
  const sql = `SELECT * FROM cart`;
  const [results] = await connection.query(sql);
  connection.end();
  res.json(results);
});

app.post("/cart", async (req, res) => {
  const connection = await getConnection();
  const { quantity, product_id } = req.body;

  const sql = `
    INSERT INTO cart (quantity, product_id)
    VALUES (?, ?)
  `;

  const [results] = await connection.query(sql, [quantity, product_id]);

  connection.end();

  res.json({
    success: true,
    id: results.insertId,
  });
});

app.get("/cart-view", async (req, res) => {
  const connection = await getConnection();
  // primero const sql = `SELECT * FROM cart` -> pero tenía que cambiar los datos
  const sql = `SELECT cart.idcart, products.name, cart.quantity, products.price FROM cart JOIN products ON cart.product_id = products.idproducts`;
  const [results] = await connection.query(sql);

  //Números
  results.forEach((item) => {
    item.price = Number(item.price);
  });

  connection.end();
  console.log(results);
  res.render("cart", { cart: results });
});

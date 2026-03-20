//1. Importar los módulos NPM que necesito instalación
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

//modulo para archivo y ruta sin instalación
//const fs = require("fs"); no la necesito
const path = require("path");

//2. Crear el servidor
const app = express();
// empezando ejercicio 4 - Añadir ejs
app.set("view engine", "ejs");

//3. Configurar el servidor
app.use(cors()); //da permiso para que lo nombren desde un servidor externo(localhost:5173 de React)
app.use(express.json()); //leer datos que te manda el frontend en json
app.use(express.static(path.join(__dirname, "../public"))); //construccion correcta de archivos

//4. Arrancar el servidor en el puerto
const serverPort = 3000;
app.listen(serverPort, () => {
  console.log(`Server listening at http//:localhost:${serverPort}`);
});

/*app.get("/", function (req, res) {
  res.send("BIENVENIDA A MI NUEVA API!");
});*/

app.get("/products", async (req, res) => {
  try {
  const connection = await getConnection(); //crea conección 
  const sql = `SELECT * FROM products`; //constante mysql para solicitar ver tabla
  const [results] = await connection.query(sql);  //coge el primero y lo iguala a la constante anterior 
  connection.end(); // cierra la conexión
  res.json(results); //lo convierte en json 
  }
  catch (error) {
    console.error (error);
    res.status(500).json ({error: "Error al obtener productos"});
  }
});

app.post("/products", async (req, res) => {
  try {
  const connection = await getConnection();
  const { name, price, category, stock } = req.body; //recibe datos front objeto
  const sql = `INSERT INTO products (name, price, category, stock) VALUES (?,?,?,?)`; //Insert BD

  const [results] = await connection.query(sql, [name, price, category, stock]); //guarda en result

  connection.end();

  res.json({
    success: true,
    id: results.insertId,
  });
} 
catch (error) {
  console.error(error);
  res.status(500).json({error: "Error al crea producto"})
}
});

app.get("/cart", async (req, res) => {
  try {
  const connection = await getConnection();
  const sql = `SELECT * FROM cart`;
  const [results] = await connection.query(sql);
  connection.end();
  res.json(results);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({error: "Error al obtener carrito"})
  }
});

app.post("/cart", async (req, res) => {
  try {
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
}
  catch (error) {
    console.error(error);
    res.status(500).json({error: "Error al insertar datos de carrito"})
  }
});

app.get("/cart-view", async (req, res) => {
  try {
  const connection = await getConnection();
  // primero const sql = `SELECT * FROM cart` -> pero tenía que cambiar los datos
  const sql = `SELECT products.name, cart.quantity, products.price FROM cart JOIN products ON cart.product_id = products.idproducts`;
  const [results] = await connection.query(sql);

  //Cambiar los valóres numéricos a números porque siempre lo cogen en sting
  results.forEach((item) => {
    item.price = Number(item.price);
  });

  connection.end();
  console.log(results);
  res.render("cart", { cart: results });
}
  catch (error) {
    console.error(error);
    res.status(500).json({error: "Error al nostrar carrito"})
    
  }
});

const express = require('express');
const routes = require('./routes');
const cors = require('cors'); //npm install cors

const app = express();
app.use(cors()); //utilizado para determinar de qual endereço a api pode ser acessada. parametro origin define o endereço. sem o parametro, todos podem acessar

app.use(express.json());

app.use(routes);

app.listen(3333);
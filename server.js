// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Iniciando o app Express
const app = express();
const port = 3000;

// Configurando o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/node-crud');

// Definindo um modelo do MongoDB
const ApiSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    corpo: {
        type: String,
        required: false
    },
    metodo: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'DELETE']
    },
    cabecalho: [
        {
            propriedade: {
                type: String,
                required: false
            },
            valor: {
                type: String,
                required: false
            }
        }
    ]
});

const Item = mongoose.model('Item', ApiSchema);

// Rota para criar um novo item (Create)
app.post('/api', async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Rota para listar todos os itens (Read)
app.get('/api', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para obter um item pelo ID (Read)
app.get('/api/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para atualizar um item pelo ID (Update)
app.put('/api/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Rota para deletar um item pelo ID (Delete)
app.delete('/api/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

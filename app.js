const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: '*', 
  credentials: true,
  optionsSuccessStatus: 200, // Ajustado erro de digitação de "optionSuccessStatus"
}

app.use(cors(corsOptions));

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const supabase = supabaseClient.createClient(
  'https://ambcmgwvjkiouusbngkn.supabase.co', 
  'sb_publishable_7hce6qOyAlEvISR2b9kceg_io0ogjbP'
);

// ==========================================
// ROTAS CORRIGIDAS PARA MINÚSCULO (/products)
// ==========================================

app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('Products')
        .select();
    res.send(data);
    console.log(`lists all Products:`, data);
});

app.get('/products/:id', async (req, res) => {
    console.log("Buscando id = " + req.params.id);
    const {data, error} = await supabase
        .from('Products')
        .select()
        .eq('id', req.params.id);
    
    // CORREÇÃO DO UNDEFINED: Como o Supabase retorna um array, 
    // precisamos mandar o objeto na posição [0] ou null se não achar.
    if (data && data.length > 0) {
        res.send(data[0]);
    } else {
        res.status(404).send("Produto não encontrado");
    }
});

app.post('/products', async (req, res) => {
    const {error} = await supabase
        .from('Products')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        });
        
    if (error) {
        return res.status(500).send(error); // Adicionado return para não duplicar resposta
    }
    res.send("created!!");
});

app.put('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('Products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id);
        
    if (error) {
        return res.status(500).send(error);
    }
    res.send("updated!!");
});

app.delete('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('Products')
        .delete()
        .eq('id', req.params.id);
        
    if (error) {
        return res.status(500).send(error);
    }
    res.send("deleted!!");
});

app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

// ==========================================
// ESCUTANDO NA REDE DA AWS (0.0.0.0)
// ==========================================
app.listen(3000, '0.0.0.0', () => {
    console.log(`> Ready and listening on all interfaces at port 3000`);
});

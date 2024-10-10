const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());
const port = 3005;

let veiculos = [];

// novo veículo
app.post('/inserir', (req, res) => {
    const { marca, modelo, ano, cor, proprietario } = req.body;
    // memória volátil(apenas na memória) => veiculos.push({ id, marca, modelo, ano, cor, proprietario });
    db.query(
        `INSERT INTO veiculos (marca, modelo, ano, cor, proprietario) VALUES (?, ?, ?, ?, ?)`,
        [marca, modelo, Number(ano), cor, proprietario],
        function (err, results, fields) {
            if (err) {
                console.error('Erro na inserção:', err);
                return;
            }
            console.log(results);
            console.log(fields);
        }
    );
    res.send(`Veículo inserido!\n\nMarca: ${marca} \nModelo: ${modelo} \nAno: ${ano} \nCor: ${cor} \nProprietário: ${proprietario}`);
});

// selecionar todos os veículos
app.get('/veiculos', (req, res) => {
    db.query(
        `SELECT * FROM veiculos`,
        function (err, results, fields) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).json({ error: 'Erro ao consultar veículos' });
            }
            // Retorna os resultados como um objeto JSON
            return res.json(results);
        }
    );
});

// atualizar por ID
app.put('/atualizar/:id', (req, res) => {
    const { id } = req.params;
    const { marca, modelo, ano, cor, proprietario } = req.body;

    db.query(
        `UPDATE veiculos set marca = ?, modelo = ?, ano = ?, cor = ?, proprietario = ? WHERE id = ?`,
        [marca, modelo, Number(ano), cor, proprietario, id],
        function (err, results, fields) {
            if (err) {
                console.error('Erro na atualização:', err);
                return;
            }
            console.log(results);
            console.log(fields);
        }
    );
    res.send(`Veículo atualizado!\n${id}\nMarca: ${marca} \nModelo: ${modelo} \nAno: ${ano} \nCor: ${cor} \nProprietário: ${proprietario}`);


});

// deletar por ID
app.delete('/deletar/id/:id', (req, res) => {
    const { id } = req.params;
    const veiculoIndex = veiculos.findIndex(v => v.id == id);

    db.query(
        `DELETE FROM veiculos WHERE id=?`,
        [number(id)],
        function(err, results, fields){
        if (err) {
            console.error('Erro na inserção');
            return;
        }
        console.log(results);
        console.log(fields);
        res.send(`Veículo atualizado!\n${id}\nMarca: ${marca} \nModelo: ${modelo} \nAno: ${ano} \nCor: ${cor} \nProprietário: ${proprietario}`);
    }

    );

});

// deletar por modelo
app.delete('/deletar/modelo/:modelo', (req, res) => {
    const { modelo } = req.params;

    db.query(
        `DELETE FROM veiculos WHERE modelo = ?`,
        [(modelo)],
        function(err, results, fields) {
            if (err) {
                console.error('Erro na deleção:', err);
                return res.status(500).json({ error: 'Erro ao deletar veículo' });
            }

            // Verifica se algum veículo foi deletado
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Veículo não encontrado' });
            }

            res.json({ message: `Veículo do modelo "${modelo}" deletado com sucesso!` });
        }
    );
});


// selecionar por ID
app.get('/veiculos/:id', (req, res) => {

    const { id } = req.params;
    const veiculo = veiculos.find(v => v.id == id); // v recebe v.id igual ao id

    db.query(
        `SELECT * FROM veiculos WHERE id = ?`,
        [Number(id)],
        function (err, results, fields) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).json({ error: 'Erro ao consultar veículos' });
            }
            // Retorna os resultados como um objeto JSON
            return res.json(results);
        }
    );
});


// selecionar por ano
app.get('/veiculos/ano/:ano', (req, res) => {
    const { ano } = req.params;
    const veiculosAno = veiculos.filter(v => v.ano == ano);

    db.query(
        `SELECT * FROM veiculos WHERE ano = ?`,
        [Number(ano)],
        function (err, results, fields) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).json({ error: 'Erro ao consultar veículos' });
            }
            // Retorna os resultados como um objeto JSON
            return res.json(results);
        }
    );
});

// selecionar todos os veículos da cor AZUL
app.get('/veiculos/cor/azul', (req, res) => {
    const veiculosAzuis = veiculos.filter(v => v.cor.toLowerCase() === 'azul');
    if (veiculosAzuis.length > 0) {
        return res.json(veiculosAzuis);
    }
    db.query(
        `SELECT * FROM veiculos WHERE cor = 'azul'`,
        function (err, results, fields) {
            if (err) {
                console.error('Erro na consulta:', err);
                return res.status(500).json({ error: 'Erro ao consultar veículos' });
            }
            return res.json(results);
        }
    );
});

app.listen(port, () => {
    console.log(`Server listening on  http://localhost:${port}`);
});
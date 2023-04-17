import express from 'express';
import { spawn } from 'child_process';

const mod = express();

mod.get('/execmd',(req,res) => {
    const cmd = req.query.cmd as string;
    const args = req.query.args as string;
    if (args==='') {
        const salida = spawn(cmd);
        salida.on('error', (error) => {
            res.send('Error con el comando');
        });
        salida.stdout.on('data', (data) => {
            res.send(data.toString());
        });
    } else {
        const salida = spawn(cmd, [args]);
        salida.on('error', (error) => {
            res.send('Error con el comando');
        });
        salida.stderr.on('data', (data) => {
            res.send('Error con el parametro');
        });
        salida.stdout.on('data', (data) => {
            res.send(data.toString());
        });
    }
});

mod.get('*', (_, res) => {
    res.send('<h1>404</h1>');
});

mod.listen(4069, () => {
    console.log('Server is up on port 4069');
  });
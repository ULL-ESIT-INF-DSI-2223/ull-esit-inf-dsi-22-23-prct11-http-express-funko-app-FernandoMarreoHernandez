import request from 'request';

const commandRequest = (cmd: string, args: string|undefined, callback: (err: string | undefined, data: request.Response | undefined) => void) => {
    const url = `http://localhost:4069/execmd?cmd=${cmd}&args=${args}`;
    request({url: url, method: 'GET'}, (error: Error, response) => {
        if (error) {
            callback('Error al enviar la solicitud GET', undefined);
        } else {
            callback(undefined, response);
        }
    });
};

const [command, ...arg] = process.argv.slice(2);
const args = arg.join(' ');
commandRequest(command, args, (err, data) => {
    if (err) {
        console.error(err);
    } else{
        console.log(data.body);
    }
}
);


    
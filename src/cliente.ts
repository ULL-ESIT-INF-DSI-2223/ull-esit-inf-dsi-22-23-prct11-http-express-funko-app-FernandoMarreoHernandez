import request from 'request';
import {Funko, Tipo, Genero} from './Funko/Funko.js';
import yargs from 'yargs';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';

interface ResponseData {
  datos: any;
  getDatos: () => any;
  getDatosUsuario: (usuario: string) => any;
  aniadirDatos: (datos: any) => void;
  eliminarDatos: () => void;
}


const ShowRequest = (usuario:string, id:number, flag:boolean, callback: (err: string | undefined, data: request.Response | undefined) => void) => {
  const url = `http://localhost:4099/funko?usuario=${usuario}&id=${id}&flag=${flag}`;
  request({url: url, method: 'GET'}, (error: Error, response) => {
    if (error) {
      callback('Error al enviar la solicitud GET', undefined);
    } else {
      callback(undefined, response);
    }
  });
};

const addRequest = (id:number,
  usuario:string,
  nombre:string,
  descripcion:string,
  tipo:Tipo,
  genero:Genero,
  franquicia:string,
  numero:number,
  exclusivo:boolean,
  caracteristicas:string,
  valor:number, callback: (err: string | undefined, data: request.Response | undefined) => void) => {
  const url = `http://localhost:4099/funko?usuario=${usuario}&id=${id}&nombre=${nombre}&descripcion=${descripcion}&tipo=${tipo}&genero=${genero}&franquicia=${franquicia}&numero=${numero}&exclusivo=${exclusivo}&caracteristicas=${caracteristicas}&valor=${valor}`;
  request({url: url, method: 'POST'}, (error: Error, response) => {
    if (error) {
      callback('Error al enviar la solicitud POST', undefined);
    } else {
      callback(undefined, response);
    }
    });
  };

const deleteRequest = (usuario:string, id:number, callback: (err: string | undefined, data: request.Response | undefined) => void) => {
  const url = `http://localhost:4099/funko?usuario=${usuario}&id=${id}`;
  request({url: url, method: 'DELETE'}, (error: Error, response) => {
    if (error) {
      callback('Error al enviar la solicitud DELETE', undefined);
    } else {
      callback(undefined, response);
    }
  });
};

const updateRequest = (id:number,
  usuario:string,
  nombre:string,
  descripcion:string,
  tipo:Tipo,
  genero:Genero,
  franquicia:string,
  numero:number,
  exclusivo:boolean,
  caracteristicas:string,
  valor:number, callback: (err: string | undefined, data: request.Response | undefined) => void) => {
  const url = `http://localhost:4099/funko?usuario=${usuario}&id=${id}&nombre=${nombre}&descripcion=${descripcion}&tipo=${tipo}&genero=${genero}&franquicia=${franquicia}&numero=${numero}&exclusivo=${exclusivo}&caracteristicas=${caracteristicas}&valor=${valor}`;
  request({url: url, method: 'PATCH'}, (error: Error, response) => {
    if (error) {
      callback('Error al enviar la solicitud PATCH', undefined);
    } else {
      callback(undefined, response);
    }
  });
};


yargs(hideBin(process.argv))
  .command('show', 'Add a new note', {
    id: {
      describe: 'id',
      demandOption: true,
      type: 'number',
    },
    usuario: {
      describe: 'usuario',
      demandOption: true,
      type: 'string',
    },
  }, (argv) => {
    let bandera = true;
    ShowRequest(argv.usuario,argv.id,bandera,(err, data) => {
      if (err) {
        console.error(err);
      } else{
        console.log(data.body);
      }
    });
  })
  .command ('add', 'Add a new note', {
    usuario: {
      description: 'Usuario', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    id: {
     description: 'Funko ID', //descripcion del campo
     type: 'number', //tipo de dato del campo
     demandOption: true //dice si el campo es obligatorio o no
    },
    nombre: {
      description: 'Funko Nombre', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    descripcion: {
      description: 'Funko Descripcion', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    tipo: {
      description: 'Funko Tipo', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    genero: {
      description: 'Funko Genero', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    franquicia: {
      description: 'Funko Franquicia', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    numero: {
      description: 'Funko Numero Franquicia', //descripcion del campo
      type: 'number', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    exclusivo: {
      description: 'Funko Exclusivo', //descripcion del campo
      type: 'boolean', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    caracteristicas: {
      description: 'Funko Caracteristicas', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    valor: {
      description: 'Funko Precio', //descripcion del campo
      type: 'number', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
   }, (argv) => {
    const tipo = argv.tipo as Tipo;
    const genero = argv.genero as Genero;
    addRequest(argv.id, argv.usuario, argv.nombre, argv.descripcion, tipo, genero, argv.franquicia, argv.numero, argv.exclusivo, argv.caracteristicas, argv.valor, (err, data) => {
      if (err) {
        console.error(err);
      } else{
        console.log(data.body);
      }
    });
  })
  .command('delete', 'Add a new note', {
    id: {
      describe: 'id',
      demandOption: true,
      type: 'number',
    },
    usuario: {
      describe: 'usuario',
      demandOption: true,
      type: 'string',
    },
  }, (argv) => {
    deleteRequest(argv.usuario,argv.id, (err, data) => {
      if (err) {
        console.error(err);
      } else{
        console.log(data.body);
      }
    });
  })
  .command ('update', 'Add a new note', {
    usuario: {
      description: 'Usuario', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    id: {
     description: 'Funko ID', //descripcion del campo
     type: 'number', //tipo de dato del campo
     demandOption: true //dice si el campo es obligatorio o no
    },
    nombre: {
      description: 'Funko Nombre', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    descripcion: {
      description: 'Funko Descripcion', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    tipo: {
      description: 'Funko Tipo', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    genero: {
      description: 'Funko Genero', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    franquicia: {
      description: 'Funko Franquicia', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    numero: {
      description: 'Funko Numero Franquicia', //descripcion del campo
      type: 'number', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    exclusivo: {
      description: 'Funko Exclusivo', //descripcion del campo
      type: 'boolean', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    caracteristicas: {
      description: 'Funko Caracteristicas', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    valor: {
      description: 'Funko Precio', //descripcion del campo
      type: 'number', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
   }, (argv) => {
    const tipo = argv.tipo as Tipo;
    const genero = argv.genero as Genero;
    updateRequest(argv.id, argv.usuario, argv.nombre, argv.descripcion, tipo, genero, argv.franquicia, argv.numero, argv.exclusivo, argv.caracteristicas, argv.valor, (err, data) => {
      if (err) {
        console.error(err);
      } else{
        console.log(data.body);
      }
    });
  })

  .command('list', 'Add a new note', {
    usuario: {
      describe: 'usuario',
      demandOption: true,
      type: 'string',
    },
  }, (argv) => {
    console.log ('Listar');
    let id = 0;
    let bandera = false;
    ShowRequest(argv.usuario,id,bandera,(err, data) => {
      if (err) {
        console.error(err);
      } else{
        console.log(data.body);
      }
    });
  })

  .help()
  .argv;



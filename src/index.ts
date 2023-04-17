import {Funko, Tipo, Genero} from './Funko/Funko';
import {ColeccionFunkos} from './Funko/ColeccionFunkos';
import { Usuario } from './Usuario/Usuario';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ColeccionDatos } from './Funko/ColeccionDatos';
import fs from 'fs';
import { exit } from 'process';
let ColeccionDatos1 = new ColeccionDatos([]);


interface ColeccionDeDatos {
  funkos: Funko[];
  Duenio: string;
}

/**
 * funcion para crear la base de datos
 * @returns void
 */
function crearBaseDatos(){
  //comprueba si existe el directorio datos
  if(!fs.existsSync('./datos')){
    //si no existe lo crea
    fs.mkdirSync('./datos');
  }
  //lee los directorios del directorio datos y crea objetos usuario con cada nombre
  fs.readdirSync('./datos').forEach(folder => {
    let usuario = new Usuario(folder);
    let ColeccionFunkos1 = new ColeccionFunkos([],usuario.GetNombre());
    //lee los archivos json de cada directorio y crea objetos funko con cada uno
    //esos funkos los añade a la coleccion de funkos del usuario
    fs.readdirSync('./datos/'+folder).forEach(file => {
      //crea el objeto funko con los datos del archivo json
      let funko = fs.readFileSync('./datos/'+folder+'/'+file);
      let funkoJson = JSON.parse(funko.toString());
      const tipo = funkoJson.Tipo as Tipo;
      const genero = funkoJson.Genero as Genero;
      let funkoObjeto = new Funko(parseInt(funkoJson.id),funkoJson.nombre,funkoJson.descripcion,genero,tipo,funkoJson.Franquicia,parseInt(funkoJson.idFranquicia),funkoJson.exclusivo,funkoJson.caracteristicas,parseInt(funkoJson.valorNumerico));
      //añade el funko a la coleccion de funkos del usuario
      ColeccionFunkos1.aniadirFunko(funkoObjeto);
    });
    //añade la coleccion de funkos del usuario a la coleccion de datos
    ColeccionDatos1.aniadirDatos(ColeccionFunkos1);
  });
}

/**
 * funcion para guardar la base de datos
 * @returns void
 * */
function guardarBaseDatos(){
  //para cada coleccion de funkos de la coleccion de datos
  ColeccionDatos1.getDatos().forEach(coleccion => {
    //busca el directorio del usuario y guarda los datos de cada funko en un archivo json
    fs.readdirSync('./datos').forEach(folder => {
      if(folder == coleccion.getDuenioColeccion()){
        coleccion.getFunkos().forEach(funko => {
          fs.writeFileSync('./datos/'+folder+'/'+funko.GetId()+'.json',JSON.stringify(funko));
        });
      }
    });
  });
}

/**
 * comandos principales
 */
yargs(hideBin(process.argv))
  //comando para añadir un funko a la base de datos
  .command('add', 'Adds a funko', {
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
  //llama al metodo para crear la base de datos
  crearBaseDatos();
  const tipo = argv.tipo as Tipo;
  const genero = argv.genero as Genero;
  //crea el objeto funko con los datos del comando
  let usuario = new Usuario(argv.usuario);
  let funko = new Funko(argv.id,argv.nombre,argv.descripcion,
    genero,tipo,argv.franquicia,argv.numero,argv.exclusivo,
    argv.caracteristicas,argv.valor);
  //comprueba si existe el usuario y si no lo crea
  if(!fs.existsSync('./datos/'+argv.usuario)){
    fs.mkdirSync('./datos/'+argv.usuario);
    let NuevaColeccionFunkos = new ColeccionFunkos([funko],usuario.GetNombre());
    ColeccionDatos1.aniadirDatos(NuevaColeccionFunkos);
  }
  else{
    //si el usuario ya existe añade el funko a su coleccion
    ColeccionDatos1.getDatosUsuario(argv.usuario)?.aniadirFunko(funko);
  }
  console.log(chalk.green('Funko añadido'));
  //guarda todos los datos en los archivos json
  guardarBaseDatos();
  })

  //comando para borrar un funko de la base de datos
  .command('delete', 'Borra un funko del usuario', {
    usuario: {
      description: 'User', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    id: {
     description: 'Funko ID', //descripcion del campo
     type: 'number', //tipo de dato del campo
     demandOption: true //dice si el campo es obligatorio o no
    },
  }, (argv) => {
    //llama al metodo para crear la base de datos
    crearBaseDatos();
    //comprueba si existe el usuario
    if(fs.existsSync('./datos/'+argv.usuario)){
      //compueba si existe el funko con ese id
      if(!ColeccionDatos1.getDatosUsuario(argv.usuario)?.getFunko(argv.id)){
        console.log(chalk.red('El funko no existe'));
        return;
      }
      //si existe borra el funko de la coleccion de funkos del usuario
      ColeccionDatos1.getDatosUsuario(argv.usuario)?.eliminarFunko(argv.id);
      //borra el archivo json del funko
      fs.unlink('./datos/'+argv.user+'/'+argv.id+'.json', (err) => {
        if (err) {
          console.error(err);
        }
      })
      console.log(chalk.green('Funko borrado'));
    }
    else{
      console.log(chalk.red('El usuario no existe'));
    }
    //guarda todos los datos en los archivos json
    guardarBaseDatos();
  })

  //comando para editar un funko de la base de datos
  .command('edit', 'Edita un funko del usuario', {
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
    //llama al metodo para crear la base de datos
    crearBaseDatos();
    //comprueba si existe el usuario
    if(!fs.existsSync('./datos/'+argv.user)){
      let usuario = new Usuario(argv.usuario);
      //compueba si existe el funko con ese id
      if(ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)){
        //modifica el funko con los datos del comando
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetNombre(argv.nombre);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetDescripcion(argv.descripcion);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetTipo(argv.tipo as Tipo);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetGenero(argv.genero as Genero);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetFranquicia(argv.franquicia);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetIdFranquicia(argv.numero);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetExclusivo(argv.exclusivo);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetCaracteristicas(argv.caracteristicas);
        ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(argv.id)?.SetValorNumerico(argv.valor);
        console.log(chalk.green('Funko editado'));
      }
      else{
        console.log(chalk.red('El funko no existe'));
      }
    }
    else{
      console.log(chalk.red('El usuario no existe'));
    }
    //guarda todos los datos en los archivos json
    guardarBaseDatos();
  })

  //comando para listar todos los funkos de todos los usuarios
  .command('list', 'Lista todos los funkos existentes', {}, (argv) => {
    //llama al metodo para crear la base de datos
    crearBaseDatos();
    //muestra todos los funkos de todos los usuarios con un color dependiendo un rango de precio
    ColeccionDatos1.getDatos()?.forEach((usuario) => {
      console.log(chalk.blue('Usuario: '+usuario.getDuenioColeccion()));
      usuario.getFunkos()?.forEach((funko) => {
        if(funko.GetValorNumerico() <= 10){
          console.log(chalk.green('Funko: '+funko.GetNombre()));
        }
        else if(funko.GetValorNumerico() <= 20 && funko.GetValorNumerico() > 10){
          console.log(chalk.yellow('Funko: '+funko.GetNombre()));
        }
        else if(funko.GetValorNumerico() <= 30 && funko.GetValorNumerico() > 20){
          console.log(chalk.magenta('Funko: '+funko.GetNombre()));
        }
        else{
          console.log(chalk.white('Funko: '+funko.GetNombre()));
        }
      })
    })
  })

  //comando para mostrar los datos de un funko de un usuario

  .command('show', 'Muestra los datos de un funko de un usuario', {
    usuario: {
      description: 'User', //descripcion del campo
      type: 'string', //tipo de dato del campo
      demandOption: true //dice si el campo es obligatorio o no
    },
    id: {
     description: 'Funko ID', //descripcion del campo
     type: 'number', //tipo de dato del campo
     demandOption: true //dice si el campo es obligatorio o no
    },
  }, (argv) => {
    //llama al metodo para crear la base de datos
    crearBaseDatos();
    //comprueba si existe el usuario
    if(fs.existsSync('./datos/'+argv.usuario)){
      let usuario = new Usuario(argv.usuario);
      //compueba si existe el funko con ese id
      ColeccionDatos1.getDatos()?.forEach((usuario) => {
        usuario.getFunkos()?.forEach((funko) => {
          if(funko.GetId() == argv.id){
            if(funko!= undefined){
              if(funko.GetValorNumerico() <= 10){
                console.log(chalk.green('id: '+funko.GetId()));
                console.log(chalk.green('Nombre: '+funko.GetNombre()));
                console.log(chalk.green('Descripcion: '+funko.GetDescripcion()));
                console.log(chalk.green('Tipo: '+funko.GetTipo()));
                console.log(chalk.green('Genero: '+funko.GetGenero()));
                console.log(chalk.green('Franquicia: '+funko.GetFranquicia()));
                console.log(chalk.green('Numero de la franquicia: '+funko.GetIdFranquicia()));
                console.log(chalk.green('Exclusivo: '+funko.GetExclusivo()));
                console.log(chalk.green('Caracteristicas: '+funko.GetCaracteristicas()));
                console.log(chalk.green('Valor: '+funko.GetValorNumerico()));
              }
              else if(funko.GetValorNumerico() <= 20 && funko.GetValorNumerico() > 10){
                console.log(chalk.yellow('id: '+funko.GetId()));
                console.log(chalk.yellow('Nombre: '+funko.GetNombre()));
                console.log(chalk.yellow('Descripcion: '+funko.GetDescripcion()));
                console.log(chalk.yellow('Tipo: '+funko.GetTipo()));
                console.log(chalk.yellow('Genero: '+funko.GetGenero()));
                console.log(chalk.yellow('Franquicia: '+funko.GetFranquicia()));
                console.log(chalk.yellow('Numero de la franquicia: '+funko.GetIdFranquicia()));
                console.log(chalk.yellow('Exclusivo: '+funko.GetExclusivo()));
                console.log(chalk.yellow('Caracteristicas: '+funko.GetCaracteristicas()));
                console.log(chalk.yellow('Valor: '+funko.GetValorNumerico()));
              }
              else if(funko.GetValorNumerico() <= 30 && funko.GetValorNumerico() > 20){
                console.log(chalk.magenta('id: '+funko.GetId()));
                console.log(chalk.magenta('Nombre: '+funko.GetNombre()));
                console.log(chalk.magenta('Descripcion: '+funko.GetDescripcion()));
                console.log(chalk.magenta('Tipo: '+funko.GetTipo()));
                console.log(chalk.magenta('Genero: '+funko.GetGenero()));
                console.log(chalk.magenta('Franquicia: '+funko.GetFranquicia()));
                console.log(chalk.magenta('Numero de la franquicia: '+funko.GetIdFranquicia()));
                console.log(chalk.magenta('Exclusivo: '+funko.GetExclusivo()));
                console.log(chalk.magenta('Caracteristicas: '+funko.GetCaracteristicas()));
                console.log(chalk.magenta('Valor: '+funko.GetValorNumerico()));
              }
              else{
                console.log(chalk.red('id: '+funko.GetId()));
                console.log(chalk.red('Nombre: '+funko.GetNombre()));
                console.log(chalk.red('Descripcion: '+funko.GetDescripcion()));
                console.log(chalk.red('Tipo: '+funko.GetTipo()));
                console.log(chalk.red('Genero: '+funko.GetGenero()));
                console.log(chalk.red('Franquicia: '+funko.GetFranquicia()));
                console.log(chalk.red('Numero de la franquicia: '+funko.GetIdFranquicia()));
                console.log(chalk.red('Exclusivo: '+funko.GetExclusivo()));
                console.log(chalk.red('Caracteristicas: '+funko.GetCaracteristicas()));
                console.log(chalk.red('Valor: '+funko.GetValorNumerico()));
              }
            }
            else{
              console.log(chalk.red('No existe el funko con ese id'));
            }
          }
        })
      })
    }
    else{
      console.log(chalk.red('No existe el usuario'));
    }
  })
 .help()
 .argv;

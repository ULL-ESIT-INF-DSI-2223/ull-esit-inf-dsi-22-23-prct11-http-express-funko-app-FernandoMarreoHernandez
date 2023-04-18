import express from 'express';
import {Funko, Tipo, Genero} from './Funko/Funko.js';
import {ColeccionFunkos} from './Funko/ColeccionFunkos.js';
import { Usuario } from './Usuario/Usuario.js';
import { ColeccionDatos } from './Funko/ColeccionDatos.js';
import fs from 'fs';
import { finished } from 'stream';
let ColeccionDatos1 = new ColeccionDatos([]);

const servidor = express();

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
 * funcion para mostrar informacion de un funko o de todos los funkos de un usuario
 */
servidor.get('/funko', (req, res) => {
  const flagayuda= req.query.flag as string;
  let flag:boolean;
  if (flagayuda === 'false'){
    flag = Boolean(!flagayuda);
  }
  else {
    flag = Boolean(flagayuda);
  }
  if(flag === true){
    let datosEnvio: (string|number|boolean)[]=[];
    const ayudaId = req.query.id as string;
    const idGet = parseInt(ayudaId);
    //comprueba si existe el usuario
    if(fs.existsSync('./datos/'+req.query.usuario)){
      let usuario = new Usuario(req.query.usuario as string);
      //compueba si existe el funko con ese id
      ColeccionDatos1.getDatos()?.forEach((usuario) => {
        usuario.getFunkos()?.forEach((funko) => {
          if(funko.GetId() == idGet){
            if(funko!= undefined){
             datosEnvio.push(funko.GetId());
             datosEnvio.push(funko.GetNombre());
             datosEnvio.push(funko.GetDescripcion());
             datosEnvio.push(funko.GetTipo());
             datosEnvio.push(funko.GetGenero());
             datosEnvio.push(funko.GetFranquicia());
             datosEnvio.push(funko.GetIdFranquicia());
             datosEnvio.push(funko.GetExclusivo());
             datosEnvio.push(funko.GetCaracteristicas());
             datosEnvio.push(funko.GetValorNumerico());
              res.send(datosEnvio);
            }
            else{
              res.send('No existe el funko con ese id');
            }
          }
        })
      })
    }
    else{
      res.send('No existe el usuario');
    }
  }
  else if (flag === false){
    if(fs.existsSync('./datos/'+req.query.usuario)){
      let salida = '';
      ColeccionDatos1.getDatos().forEach(usuario => {
      if(usuario.getDuenioColeccion() == req.query.usuario){
        usuario.getFunkos().forEach(funko => {
          salida+= funko.GetNombre() + '\n';
        });
      }
      });
      res.send(salida);
    }
    else{
      res.send('No existe el usuario');
    }
  }
});

/**
 * el servidor crea un funko y lo añade a la coleccion
 */
servidor.post('/funko', (req, res) => {
  const ayudaId = req.query.id as string;
  const idGet = parseInt(ayudaId);
  const ayudaIdFranquicia = req.query.numero as string;
  const idFranquiciaGet = parseInt(ayudaIdFranquicia);
  const ayudaValorNumerico = req.query.valor as string;
  const valorNumericoGet = parseInt(ayudaValorNumerico);
  const tipoGet = req.query.tipo as Tipo;
  const generoGet = req.query.genero as Genero;
  const ayudaExclusivo = req.query.exclusivo as string;
  const exclusivoGet = Boolean(ayudaExclusivo);
  //crea el objeto funko con los datos del comando
  let usuario = new Usuario(req.query.usuario as string);
  //busca si hay un funko con el mismo id
  if (ColeccionDatos1.getDatosUsuario(req.query.usuario as string)?.getFunko(idGet) != undefined){
    //si existe envia un mensaje de error al cliente
    res.send('Ya existe un funko con ese id');
    finished;
  }
  //comprueba si el valor numerico es un numero negativo
  else if (valorNumericoGet < 0){
    res.send('El valor numerico no puede ser negativo');
  }
  else{
  let funko = new Funko(idGet,
    req.query.nombre as string,
    req.query.descripcion as string,
    generoGet,
    tipoGet,
    req.query.franquicia as string,
    idFranquiciaGet,
    exclusivoGet,
    req.query.caracteristicas as string,
    valorNumericoGet);
  //comprueba si existe el usuario y si no lo crea
  if(!fs.existsSync('./datos/'+req.query.usuario)){
    fs.mkdirSync('./datos/'+req.query.usuario);
    let NuevaColeccionFunkos = new ColeccionFunkos([funko],usuario.GetNombre());
    ColeccionDatos1.aniadirDatos(NuevaColeccionFunkos);
  }
  else{
    //si el usuario ya existe añade el funko a su coleccion
    ColeccionDatos1.getDatosUsuario(req.query.usuario as string)?.aniadirFunko(funko);
  }
  res.send('Funko añadido');
  //guarda todos los datos en los archivos json
  guardarBaseDatos();
}
});

/**
 * el servidor borra un funko de la coleccion del usuario
 */
servidor.delete('/funko', (req, res) => {
  const ayudaId = req.query.id as string;
  const idGet = parseInt(ayudaId);
  if(fs.existsSync('./datos/'+req.query.usuario as string)){
    //compueba si existe el funko con ese id
    if(!ColeccionDatos1.getDatosUsuario(req.query.usuario as string)?.getFunko(idGet)){
      res.send('El funko no existe');
      return;
    }
    //si existe borra el funko de la coleccion de funkos del usuario
    ColeccionDatos1.getDatosUsuario(req.query.usuario as string)?.eliminarFunko(idGet);
    //borra el archivo json del funko
    fs.unlink('./datos/'+req.query.usuario as string+'/'+idGet+'.json', (err) => {
      if (err) {
        console.error(err);
      }
    })
    res.send('Funko borrado');
  }
  else{
    res.send('El usuario no existe');
  }
  //guarda todos los datos en los archivos json
  guardarBaseDatos();
});

/**
 * el servidor modifica un funko en funcion a los parametros indicados
 */
servidor.patch('/funko', (req, res) => {
  const ayudaId = req.query.id as string;
  const idGet = parseInt(ayudaId);
  const ayudaIdFranquicia = req.query.numero as string;
  const idFranquiciaGet = parseInt(ayudaIdFranquicia);
  const ayudaValorNumerico = req.query.valor as string;
  const valorNumericoGet = parseInt(ayudaValorNumerico);
  const tipoGet = req.query.tipo as Tipo;
  const generoGet = req.query.genero as Genero;
  const ayudaExclusivo = req.query.exclusivo as string;
  const exclusivoGet = Boolean(ayudaExclusivo);
  //comprueba si existe el usuario
  if(!fs.existsSync('./datos/'+req.query.usuario as string)){
    let usuario = new Usuario(req.query.usuario as string);
    //compueba si existe el funko con ese id
    if(ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)){
      //modifica el funko con los datos del comando
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetNombre(req.query.nombre as string);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetDescripcion(req.query.descripcion as string);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetTipo(req.query.tipo as Tipo);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetGenero(req.query.genero as Genero);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetFranquicia(req.query.franquicia as string);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetIdFranquicia(idFranquiciaGet);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetExclusivo(exclusivoGet);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetCaracteristicas(req.query.caracteristicas as string);
      ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(idGet)?.SetValorNumerico(valorNumericoGet);
      res.send('Funko editado');
    }
    else{
      res.send('El funko no existe');
    }
  }
  else{
    res.send('El usuario no existe');
  }
  //guarda todos los datos en los archivos json
  guardarBaseDatos();
});

/**
 * inicia el servidor en el puerto indicado
 * y crea la base de datos
 */
servidor.listen(4099, () => {
  console.log('Server is up on port 4099');
    //llama al metodo para crear la base de datos
    crearBaseDatos();
});


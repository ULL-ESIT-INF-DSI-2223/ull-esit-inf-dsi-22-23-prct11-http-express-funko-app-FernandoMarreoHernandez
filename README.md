# Práctica 11 - Creación de una aplicación Express para gestionar el registro de Funko Pops

## Indice
- [Práctica 11 - Creación de una aplicación Express para gestionar el registro de Funko Pops](#práctica-11---creación-de-una-aplicación-express-para-gestionar-el-registro-de-funko-pops)
  - [Indice](#indice)
  - [Introducción](#introducción)
  - [Cliente](#cliente)
  - [Servidor](#servidor)
    - [Ejercicio presencial](#ejercicio-presencial)
    - [conclusiones](#conclusiones)

## Introducción

Para esta practica teniamos que volver a repetir el cliente y el servidor de la base de datos de funkos, pero esta vez teniamos que hacerlo con express y con callbacks.

primero explicar que es express, express es un framework de node.js que nos permite crear aplicaciones web de una forma más sencilla y rápida.
por otra parte, los callbacks son funciones que se ejecutan cuando se produce un evento, en este caso cuando se produce una petición http.

## Cliente
lo primero que vamos a explicar es el cliente. En este, aparte de tener los yargs ya hechos de las practicas anteriores, contaremos con los request que nos permiten hacer las peticiones http.
En este caso tenemos las siguientes funciones:

```typescript
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
```
como podemos ver, tenemos las funciones de show, add, delete y update, que son las que nos permiten hacer las peticiones http para obtener datos, añadir datos, borrar datos y actualizar datos respectivamente.

Tras esto el resto del codigo es practicamente similar al de la practica anterior. Un ejemplo de una de las funciones de show sería la siguiente:

```typescript
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
```
como podemos ver, en este caso tenemos que pasarle el usuario, el id y la bandera, que en este caso es false, ya que no queremos que nos muestre solo un funko, sino todos los que tenemos en la base de datos. Una vez enviados los datos, se espera a la respuesta y dependiendo de si hay error o no, se muestra por pantalla lo que nos devuelve el servidor.

## Servidor

En el servidor lo primero que hacemos es crearlo con express:


```typescript
const servidor = express();
```

Una vez creado el servidor y tras poner las funciones ya usadas en practicas anteriores para crear y eliminar la base de datos, empezamos a crear las funciones del servidor. En este caso tenemos las siguientes funciones:

```typescript
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
```
Al igual que antes en el cliente y como se puede apreciar, el codigo es muy similar a como hemos hecho en practicas anteriores, cambiando los metodos para mostrar los resultados a **send** para enviar los mismos al cliente.

Aparte de esto, en el servidor hay que decirle en que puerto se va a poner a escuchar, y ya de paso, como es algo que vamos a hacer siempre al principio, en este vamos a invocar la funcion para crear la base de datos del mismo:

```typescript
servidor.listen(4099, () => {
  console.log('Server is up on port 4099');
    //llama al metodo para crear la base de datos
    crearBaseDatos();
});
```
Como se puede apreciar, el servidor esta escuchando en el puerto 4099 en este caso, y al iniciar el servidor, se llama al metodo para crear la base de datos.

### Ejercicio presencial

Por último, como ejercicio presencial nos toco hacer algo similar a la practica pero mas reducido y donde el cliente mandara un comando de linux al servidor para que este lo ejecute y nos devuelva el resultado.

la principal diferencia es que usamos los child-process, mas especificamente el **spawn** para que ejcutara el comando que le mandamos, y el **on** para que nos devolviera el resultado de la ejecucion del comando.

### conclusiones

Tras ver la practica anterior y esta, se puede apreciar la facilidad y la velocidad con la que se puede trabajar con las url, express y los callbacks, ademas de ver enlaces y cosas que de normal ves en la vida cotidiana y planteandote dudas de cosas que pueden llegarse a hacer con ellas.

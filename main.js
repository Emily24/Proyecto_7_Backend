console.log('Hola mundo con Node JS')

// forma antigua de llamar libreria
// const express = require('express')

// forma actual con ECMAScript 6 de llamar librerias
import bodyParser from 'body-parser'
import client from './db.js'
import express from 'express'
import {ObjectId} from 'mongodb'


const app = express()
const port = 3000

app.use(bodyParser.json())

// ---------------- Endpoint -------------------
// con 'get' le indicamos que nuestra API acepta
// el metodo GET.
// El primer parametro establece el path (ruta) del
// código que queremos ejecutar
// El segundo parametro establece el código a ejecutar
// en forma de callback
// - el callback recibe 2 parametros:
// - req: request o la peticion
// - res: response o la respuesta
app.get('/api/v1/usuarios', async (req, res) => {

    console.log(req.query)

    //1. Conectarse a la base de datos
    await client.connect()

    //2. Seleccionar la BD que vamos a utilizar
    const db = client.db('sample_mflix')

    //3. Seleccionar la colección
    const users = db.collection('users')

    //4. Hacer la consulta -> Query
    const listaUsuario = await users.find({}).toArray()
    
    console.log(listaUsuario)

    //5. Cerrar la consulta y conexión a la BD
    await client.close()


    // const respuesta = {
    //     mensaje: "hola"
    // }

    // res.json(respuesta)

    res.json({
        mensaje: 'lista de usuarios',
        data: listaUsuario
    })
})

//Obtener un usuario
app.get('/api/v1/usuarios/:id', async (req, res) => {

    console.log(req.params)
    let id = req.params.id

    //1. Conectarse a la base de datos
    await client.connect()

    //2. Seleccionar la BD que vamos a utilizar
    const db = client.db('sample_mflix')

    //3. Seleccionar la colección
    const users = db.collection('users')

    id = new ObjectId(id)

    //4. consulta
    const user = await users.findOne({
        _id: id
    })

    //5. Cerra la conexión
    await client.close()

    res.json({
        mensaje: `usuario obtenido con el id: ${id}`,
        data: user
    })
})

// post: crear datos
app.post('/api/v1/usuarios', async (req, res) => {

    console.log(req.body)
    const userData = req.body

    //1. Conectarse a la base de datos
    await client.connect()

    //2. Seleccionar la BD que vamos a utilizar
    const db = client.db('sample_mflix')

    //3. Seleccionar la colección
    const users = db.collection('users')

    //------CRUD--------
    //4. Almacenar un usuario
    await users.insertOne({
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        edad: userData.edad,
        //ubicacion: userData.ubicacion
        ubicacion: {
            latitud: userData.ubicacion.latitud,
            longitud: userData.ubicacion.longitud

        }

    })

    //5. Cerrar conexión
    await client.close()


    res.json({
        mensaje: 'usuario guardado'
    })
})

// put: actualizar todos los
// datos de un elemento
app.put('/api/v1/usuarios/:id', async (req, res) => {

    let id = req.params.id
    const userData = req.body

    //1. Conectarse a la base de datos
    await client.connect()

    //2. Seleccionar la BD que vamos a utilizar
    const db = client.db('sample_mflix')

    //3. Seleccionar la colección
    const users = db.collection('users')

    id = new ObjectId(id)

    //4. Realizar consulta a la BD
    const user = await users.updateOne(
        {_id: id},
        {
            $set: {
                name: userData.name
            }
        }
    )
    
    //5. Cerra la conexión

    await client.close()

    res.json({
        mensaje: `usuario con el Id ${id} actualizado`
    })
})

// patch: actualiza algunos campos
// de nuestro elemetno
app.patch('/api/v1/usuarios/:cedula', (req, res) => {

    const cedula = req.params.cedula

    res.json({
        mensaje: `edad del usuario con cedula ${cedula} actualizada`
    })
})

// delete: eliminar un elemento
app.delete('/api/v1/usuarios/:id',async (req, res) => {

    let id = req.params.id

    //1. Conectarse a la base de datos
    await client.connect()

    //2. Seleccionar la BD que vamos a utilizar
    const db = client.db('sample_mflix')

    //3. Seleccionar la colección
    const users = db.collection('users')

    id = new ObjectId(id)
    //4.Conexión con la BD
    await users.deleteOne({
        _id:id
    })

    await client.close()

    
    res.json({
        mensaje: `usuario con el Id ${id} eliminado`
    })
})

// Le indicamos a nuesta API que empiece a escuchar peticiones
// en el puerto 3000 y cuando se encienda nos muestre el mensaje
// que hay en el console.log
app.listen(port, () => {
    console.log(`La API esta escuchando en el puerto ${port}`)
})

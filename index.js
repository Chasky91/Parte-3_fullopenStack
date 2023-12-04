import http from 'http'
import express from 'express'
import cors from 'cors'



let notes = [  
  {
    id: 1,    content: "HTML is easy",    
    date: "2019-05-30T17:30:31.098Z",   
    important: true 
  }, 
  {   
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false 
  },  
  {   
    id: 3,    
    content: "GET and POST are the most important methods of HTTP protocol",    
    date: "2019-05-30T19:20:14.298Z",    
    important: true  
  }
]

const generatedID = () =>{
  let maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) :  0
  return maxId+1
}



const app = express()

app.use(express.json())

app.use(cors())

const requesLogger = (req, res, next) => {
  console.log('Method', req.method)
  console.log('Path', req.path)
  console.log('Body', req.body)
  console.log('___')
  next()
}

app.use(requesLogger)

app.use(express.static('dist'))


app.get("/", (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get("/api/notas", (req, res) => {
  console.log(typeof notes);
  res.json(notes)
})

app.get("/api/notas/:id", (req, res) => {
  const  id =Number(req.params.id)
  const note = notes.find(nota => nota.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notas/:id',(req, res) => {

  const id = Number(req.params.id)

  notes = notes.filter( n => n.id !== id)
  res.status(204).end()

})

app.post("/api/notas", (req, res) => {
  //pasa como paramestro cada uno de los id y clacula el maximo
  if(!req.body) {
    return res.status(400).json({"error": "falta contenido"})
  }
  

  const nota = {
    content :req.body.content,
    important: req.body.important || false,
    date: new Date(),
    id: generatedID()
  
  }

  notes =notes.concat(nota)  
  console.log(req.headers)
  res.json(nota)
})

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({"Error":"Sitio no encontrado"})
}


const PORT = 3002
app.listen(PORT, () => {
  console.log(`Corriendo por el puerto ${PORT}`)
})
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const port = 5500

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}))
app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/ADG_DATABASE')
const db = mongoose.connection
db.once('open',()=>{
    console.log("Mongodb connection succesful")
})

/*DataBase Pedido*/
const userSchema = new mongoose.Schema({
    name:String,
    no_mesa:String,
    slct_plato: String,
    slct_bebida: String,
    slct_postre: String, 
})

const Users = mongoose.model("Ordenes",userSchema)

app.get('/pedido',(req,res)=>{
    res.sendFile(path.join(__dirname,'PedidoPrueba.html'))
})


app.post('/post',async (req,res)=>{
    const {name, no_mesa, slct_plato, slct_bebida, slct_postre} = req.body 
    const user = new Users({
        name,
        no_mesa,
        slct_plato,
        slct_bebida,
        slct_postre
    })
    await user.save()
    console.log(user)
    res.send("Form submission successful")
})
/*----------------------------------------------------------------------------------------------*/

/*DATABASERESERVAR*/
const reservaSchema = new mongoose.Schema({
    cantidad:String,
    name:String,
    no_tel: String,
    email: String,
    date: String,
    time: String, 
})

const Reserva = mongoose.model("Reserva",reservaSchema)

app.get('/reservar',(req,res)=>{
    res.sendFile(path.join(__dirname,'ReservarPrueba.html'))
})

app.post('/post1',async (req,res)=>{
    const {cantidad, name, no_tel, email, date, time} = req.body 
    const reserva = new Reserva({
        cantidad,
        name,
        no_tel,
        email,
        date,
        time
    })
    await reserva.save()
    console.log(reserva)
    res.send("Form submission successful")
})
/*----------------------------------------------------------------------------------------------*/

/*DATABASECRUD*/


const IngredientSchema = new mongoose.Schema({
    _id: Number, 
    name: String,
    price: Number
  });
  const Ingredient = mongoose.model('Ingredient', IngredientSchema);
  
  
  const CounterSchema = new mongoose.Schema({
    _id: String,
    sequence_value: { type: Number, default: 1 }
  });
  const Counter = mongoose.model('Counter', CounterSchema); 
  
  
  
  
  app.post('/api/ingredients', async (req, res) => {
    try {
      
      const nextId = await getNextSequence('ingredient_id');
  
      
      const newIngredient = new Ingredient({ 
          ...req.body, 
          _id: nextId 
      });
      await newIngredient.save();
  
      res.status(201).json(newIngredient);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  
  app.get('/api/ingredients', async (req, res) => {
    try {
      const ingredients = await Ingredient.find();
      res.json(ingredients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  app.get('/api/ingredients/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const ingredient = await Ingredient.findById(id);
  
      if (ingredient) {
        res.json(ingredient);
      } else {
        res.status(404).json({ message: 'Ingrediente no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  app.put('/api/ingredients/:id', async (req, res) => {
    try {
      const updatedIngredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedIngredient);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  
  app.delete('/api/ingredients/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await Ingredient.findByIdAndDelete(id);
      res.status(204).send(); 
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  
  async function getNextSequence(name) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: name }, 
        { $inc: { sequence_value: 1 } }, 
        { new: true }
      );
      return counter.sequence_value;
    } catch (err) {
      console.error("Error al obtener el siguiente ID:", err);
      throw err;
    }
  }
  
  
  async function initializeCounter() {
    try {
      const counter = await Counter.findOne({ _id: 'ingredient_id' });
      if (!counter) {
        await Counter.create({ _id: 'ingredient_id', sequence_value: 1 });
      }
    } catch (err) {
      console.error("Error al inicializar el contador:", err);
    }
  }
  
 
  app.use(cors());
  
  initializeCounter() 
  
/*----------------------------------------------------------------------------------------------*/

app.listen(port,()=>{
    console.log("Server started")
})
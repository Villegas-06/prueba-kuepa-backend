//importo las librerias de express, cors, body-parser, compression para el correcto funcionamiento de la API

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));


const port = 3000

//reliazo las importaciones del la conexión y el modelo

const connect = require('./network/connection');
const Model = require('./network/modeL');

//creo las API a utilizar

app.get("/messages", async (req, res) => {
  const messages = await Model.Message.find();
  res.json(messages);
});

app.post('/messages', async (req, res) => {

  if (req.body.text != "") {

    const newMessage = {
      "username": req.body.username,
      "rol": req.body.rol,
      "message": req.body.text,
      "date": new Date()
    };

    connect.addMessage(newMessage);

    res.send("Enviado con éxito")

  } else {

    res.send("Error");

  }



});

const requireAuth = (req, res, next) => {
  /*if (!req.session || !req.session.userId) {
    return res.status(401).send('Unauthorized');
  }*/
  next();
};

app.get('/user', requireAuth, async (req, res) => {
  try {
    const user = await Model.User.findById(req.session);
    if (!user) return res.status(404).send('User not found');
    res.send({ username: user.username, typeUser: user.typeUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting current user');
  }
});


app.post('/users', async (req, res) => {

  if (req.body.user != "" || req.body.username != "" || req.body.password != "" || req.body.typeUser != "") {

    const newUser = {
      user: req.body.user,
      username: req.body.username,
      password: req.body.password,
      typeUser: req.body.typeUser,
      dateCreated: new Date()
    };

    try {

      const user = new Model.User(newUser);
      console.log(user == newUser);
      await user.save();
      res.send('User created successfully');

    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering new user');

    }
  } else {
    res.status(500).send('Error registering new user');
  }

});

app.post('/iniciosesion', async (req, res) => {

  const { username, password } = req.body;

  console.log(username, password)

  try {
    const user = await Model.User.findOne({ username });
    if (!user) return res.status(404).send('User not found');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    res.send('User authenticated successfully');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error authenticating user');
  }

})



app.listen(port, () => {
  console.log(`I listen in port http://localhost:${port}`)
});


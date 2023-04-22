//importar la libreria de mongoDB mongoose
const db = require('mongoose');

//importar el componente modelo
const Model = require('./modeL');

//realizar la conexión a la BD
db.Promise = global.Promise;
db.connect('mongodb+srv://miguelmoville:1234@test-kuepa.f4aoiyu.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
});

//Debug para la conexión
console.log('[db] Conectada con éxito');

//Funciones para añadir el usuario y mensaje

function addUser (userDB) {
    const myUser = new Model.User(userDB);
    myUser.save();
}

function addMessage (userDB){
    const myMessage = new Model.Message(userDB) 
    myMessage.save();
}

//exportar ambas funciones como componentes

module.exports = {
    addUser: addUser,
    addMessage: addMessage
}

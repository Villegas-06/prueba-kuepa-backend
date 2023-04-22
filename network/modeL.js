//importar la libreria de mongoDB mongoose y bcrypt
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Creo el esquema a utilizar
const Schema = mongoose.Schema;

/*NOTA: el esquema es la manera en como defino que objetos (clave: valor)
    van a entrar a la base de datos*/

const mySchema = new Schema({
    user: String,
    username: String,
    password: String,
    typeUser: String,
    dateCreated: Date
});

mySchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

mySchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const messageSchema = new Schema({
    username: String,
    rol: String,
    message: {
        type: String,
        required: true
    },
    date: Date
})

//creo los métodos y los exporto

const User = mongoose.model("User", mySchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = {
    User, 
    Message
};

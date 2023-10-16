const jwt = require("jsonwebtoken");
const userModel = require("../../Schema/Users");


class User {
    constructor(userToken){
        this._key =
        "a4e27f15bb12d99897a30b35ead719a81ad6a37ade8b0f0251453b2ebc03a600";
        this.userToken = userToken;
        this._decodeJwt();
    }
    _decodeJwt(){
        const payload = jwt.verify(this.userToken , this._key);
        this.UserData = payload;
    }
    async saveUser(password){
        const DataToBeSaved = {...this.UserData , "Password" : password};
        await userModel.create(DataToBeSaved);
    }


   

}


module.exports = User;
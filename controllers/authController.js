//For now I am mocking the database, just so for testing purposes

let users = [];

exports.getLogin = (req, res) =>{
    //later we can add the implementation here
};

exports.postLogin = (req, res) =>{
    //later we can add the implementation here
};

exports.getRegistrationPage = (req, res) =>{
    //later we can add the implementation here
};

exports.postRegistrationPage = (req, res) =>{
    //later we can add the implementation here
};
//Just to rest our mock database
exports._resetUsers = () => {users = [];}

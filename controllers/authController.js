const User = require('../models/user');
const jwt = require('jsonwebtoken');
//handle errors
const handleErrors = (err) =>{
    console.log(err.mesaage, err.code);
    let errors = {email:'', password:''};
    //duplicate error code
    if(err.code === 11000){
        errors.email = 'that email is already registered';
    return errors;
    }

    //validation erors
    if(err.message.includes('user validation falis')){
       Object.values(err.errors).forEach(({properties})=>{
        errors[properties.path] = properties.message;
       });
    }
    return errors;
}

const createToken = (id) =>{
return jwt.sign({id}, 'net ninja secret', {
    expiresIn: maxAge
});
}
const maxAge = 3 * 24 * 60 * 60;

module.exports.signup_get=(req, res) =>{
    res.render('signup');
}

module.exports.login_get=(req, res)=>{
    res.render('login');
} 

module.exports.signup_post= async (req, res)=>{
     //we want email password from req
     const {email, password} = req.body;
    try{
       const user =  User.create({email, password});
       const token = createToken(user._id);
       res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user_id});
        // console.log(req.body);
    }
    catch(err){
const errors = handleErrors(err);
res.status(400).json({errors});
    }
}

module.exports.login_post= async (req, res)=>{
    //we want email password from req
    const {email, password} = req.body;
    try{
const user = await User.login(email, password);
res.status(200).json({ user: user._id })
    }
    catch(err){
res.status(400).json({});
    }
}


module.exports.logout_get = (req, res) =>{
    res.cookie('jwt', ''), {maxAge: 1};
    res.redirect('/');
}


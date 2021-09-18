
const User=require("../../../model/Users");
const jwt=require('jsonwebtoken')
//handle errors 
const handleErrors=(err)=>{
    console.log(err.message,err.code);
    //if there is an error in email we return password and if password error then return email
    let errors={email:"",password:""}

    //incorrect Email
    if (err.message==='Incorrect Email Provided'){
        errors.email='This email is not registered with us'
    }
    //incorrect Password
    if (err.message==='Incorrect password'){
        errors.password='Sorry That password is incorrect'
    }

    //duplicate key Errors
    if (err.code===11000){
        errors.email='that email is already registered with us';
        return errors;
    }

    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        })
    }
    return errors;
}
const maxAge=3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},'dassmik secret',{
        expiresIn:maxAge
    });
}



module.exports.signup_get=(req,res)=>{
    res.render('signup');
}

module.exports.login_get=(req,res)=>{
    res.render('Login');
}

module.exports.signup_post=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.create({email,password});
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    }
    catch (err){
        const errors=handleErrors(err);
        res.status(400).json({errors})
    }
}

module.exports.login_post=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.login(email,password);
        res.status(200).json({user:user._id});
    }
    catch(err){
        const errors=handleErrors(err);
        res.status(400).json({errors});
    }
}


module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1})
}
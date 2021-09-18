const mongoose=require('mongoose');
const {isEmail}=require('validator')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        // required:true,
        //If the user doesn't enter an email show them the error that we need an email id
        required:[true,'Please enter the email id'],
        unique:true,
        lowercase:true,
        //This will help in validating the email id, isEmail is a built in function from validator package that checks wheteher an email is valid or not
        validate:[isEmail,'Please enter an valid email id']
    },
    password:{
        type:String,
        required:[true,'Please enter the password'],
        minlength:[6,'Minimum password length is 6']
    }
})


//fire a function just before an user is saved to the db,actually these are all middleware next is a middleware
userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);

    next();
})
//static method to log users in 
userSchema.statics.login = async function(email,password){
    const user =await this.findOne({email});
    if (user){
        const auth= await bcrypt.compare(password,user.password);
        if (auth){
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect Email Provided")
}


const User=mongoose.model('user',userSchema)

module.exports=User
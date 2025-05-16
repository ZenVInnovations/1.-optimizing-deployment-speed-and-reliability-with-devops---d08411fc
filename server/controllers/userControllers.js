const User=require("../models/userModels")
const jwt=require("jsonwebtoken")
const bcrypt =require('bcrypt')
const HttpError=require("../models/errorModel")
const {v4:uuid} =require("uuid")
const fs = require('fs')
const path =require('path')
/*=============================    Register New A User    ======================================== */
//POST:api/users/register
//UNPROTECTED
const registerUser =async (req,res,next)=>{
  //res.json("new register")
  try{
    const {name,email,password,password2}=req.body;
    if(!name ||!email ||!password){
      return next(new HttpError("Fill in all field.",422))
    }
    const newEmail=email.toLowerCase()
    const emailExists = await User.findOne({email:newEmail})
    if(emailExists){
      return next(new HttpError("email already exists.",422))
    }
   if((password.trim().length < 6)){
    return next(new HttpError("password must be at least 6 characters.",422))
   }
   if(password != password2){
    return next(new HttpError("password does not match.",422))
   }

   const salt = await bcrypt.genSalt(10)
   const hashpass= await bcrypt.hash(password,salt);
   const newUser = await User.create({name,email:newEmail,password:hashpass})
   res.status(201).json(`New user ${newUser.email} registered`)
  }catch(error){
    return next(new HttpError("user registration failed.",422))
  }
    
}

/*=============================   login  User    ======================================== */
//POST:api/users/login
//UNPROTECTED
const loginUser =async(req,res,next)=>{
  //res.json("Login User")
   try{
    const{email,password}=req.body;
    if(!email || !password){
      return next(new HttpError("Fill in all Feilds.",422))
    }
    const newEmail=email.toLowerCase()
    const user =await User.findOne({email:newEmail})
    if(!user){
      return next(new HttpError("invaild credentails.",422))
    }
    const comparePass =await bcrypt.compare(password,user.password)
    if(!comparePass){
      return next(new HttpError("invalid credentails.",422))
    }
    const {_id:id,name} = user;
    const token = jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.status(200).json({token,id,name})

   }catch(error){
    return next(new HttpError("Login failed please check the credentials",422))
   }
}

/*=============================    User profile    ======================================== */
//POST:api/users/:id
//PROTECTED
const getUser =async(req,res,next)=>{
   // res.json("User profile ")
   try{
    const {id}=req.params;
    const user = await User.findById(id).select('-password');
    if(!user){
      return next(new HttpError("User not found.",404))

    }
    res.status(200).json(user);
   }catch(error){
    return next(new HttpError(error))
   }

}

/*=============================    change user avatar{profile picture} ======================================== */
//POST:api/users/change-avatar
//PROTECTED
const changeAvatar =async(req,res,next)=>{
    //res.json("Change User profile ")
    try{
      //res.json(req.files)
      //console.log(req.files)
      if(!req.files.avatar){
        return next(new HttpError("Please choose an image.",422))
      }
      //find user from database
        const user = await User.findById(req.user.id)
      // delete old avatar
      if(user.avatar){
        fs.unlink(path.join(__dirname, '..','uploads',user.avatar),(err)=>{
          if(err){
          return next(new HttpError(err))
          }
        })
      }
      const {avatar}= req.files;
      //check file size
      if(avatar.size >700000){
        return next(new HttpError("profile picture too big ,should be less than 700kb"),422)
      }
      let fileName;
      fileName = avatar.name;

      let splittedFilename = fileName.split('.')
      let newFilename = splittedFilename[0]+ uuid() + '.'+ splittedFilename[splittedFilename.length -1]
      avatar.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
        if(err){
          return next(new HttpError(err))
        }
        const updatedAvatar = await User.findByIdAndUpdate(req.user.id,{avatar:newFilename},{new:true})
        if(!updatedAvatar){
          return next(new HttpError("Avatar couldn't be changed",422))
        }
        res.status(200).json(updatedAvatar)
      })
     
    }catch(error){
      return next(new HttpError(error))
    }
}

/*=============================    EDIT USER DETAISL{from profile} ======================================== */
//POST:api/users/edit-user
//PROTECTED
const editUser =async(req,res,next)=>{
    //res.json("edit User detail")
    try{
      const {name,email,currentPassword,newPassword,confirmNewPassword}=req.body;
      if(!name ||!email || !currentPassword || !newPassword){
        return next(new HttpError("Fill in all fields.",422))
      }
      //get user from database
      const user = await User.findById(req.user.id);
      if(!user){
        return next(new HttpError("User not found.",403))
      }
//make sure new email doesnt already exist
       const emailExist = await User.findOne({email});
//we want to update other detaisl with/without changing the emial{which is a unique id because we use it ti login}
       if(emailExist && (emailExist._id != req.user.id)){
        return next(new HttpError("Email already exists.",422))
       }
           //comapre current password to database password
      const validateUserpassword = await bcrypt.compare(currentPassword,user.password);
if(!validateUserpassword){
  return next(new HttpError("invalid current password",422))
}
//compare new password
if(newPassword !== confirmNewPassword){
  return next(new HttpError("new passwords do not match",422))
}
//hash new password

const salt= await bcrypt.genSalt(10)
const hash = await bcrypt.hash(newPassword,salt);

//update user info in database

const newInfo = await User.findByIdAndUpdate(req.user.id,{name,email,password :hash},{new:true})
res.status(200).json(newInfo)

    }catch(error){
      return next(new HttpError(error))
    }
}

/*=============================    get Authors ======================================== */
//POST:api/users/authors
//PROTECTED
const getAuthors =async(req,res,next)=>{
    //res.json("get all user/authors")
    try{
      const authors = await User.find().select('-password');
      res.json(authors);
    }catch(error){
      return next(new HttpError(error))
    }
}



module.exports={registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors}
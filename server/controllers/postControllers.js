const Post = require('../models/postModels')
const User = require('../models/userModels')
const path = require('path')
const fs =require('fs')
const{v4:uuid}= require('uuid')
const HttpError = require('../models/errorModel')



//================================ Create Post +++++=============================================
//Post:api/posts

const router = require("../routes/postRoutes")
const { request } = require('express')

//Protected
const createPost= async(req,res,next)=>{
    //res.json("Create post")

    try{
        let {title,category,description} = req.body;
        if(!title|| !category || !description || !req.files){
            return next(new HttpError("Fill in all form and choose thumbnail",422))
        }
        const {thumbnail} = req.files;
        if(thumbnail.size > 20000000){
            return next(new HttpError("Thumbnail too big .File should be less than 2mb."))
        }
        let fileName = thumbnail.name;
        let splittedFilename =fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
        thumbnail.mv(path.join(__dirname, '..' , '/uploads' , newFilename),async(err)=>{
            if(err){
              return next(new HttpError(err))
            }else{
                const newPost = await Post.create({title,category,description,thumbnail:newFilename,
                    creator:req.user.id})
                    if(!newPost){
                        return next(new HttpError("post couldn't be created.",422))
                    }
                    //find user and increase post count by 1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser.posts +1;
                    await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})
                    res.status(201).json(newPost)
            }
        })

    }catch(error){
        return next(new HttpError(error))
    }
}

//================================ get all Post +++++=============================================
//Post:api/posts
//unProtected
const getPosts= async(req,res,next)=>{
    //res.json("get all posts")
    try{
        const posts = await Post.find().sort({updatedAt: -1})
        res.status(200).json(posts)
    }catch(error){
        return next(new HttpError(error))
    }
  
}

//================================ Single Post +++++=============================================
//get:api/posts/:id
//unProtected
const getPost= async(req,res,next)=>{
    //res.json("get single post")
    try{
        const postId=req.params.id;
        const post = await Post.findById(postId)
        if(!post){
            return next(new HttpError("post not found",404))
        }
        res.status(200).json(post)
    }catch(error){
        return next(new HttpError("Post not found"))
    }

}

//================================  get Post by category +++++=============================================
//get:api/posts/categories/:category
//unProtected
const getCatPosts= async(req,res,next)=>{
    //res.json("get Post by categories")
    try{
        const{category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
    }catch(error){
        return next(new HttpError(error))
    }
}

//================================ get user/author Post +++++=============================================
//get:api/posts/users/:id
//unProtected
const getUserPosts= async(req,res,next)=>{
    //res.json("get user posts")
    try{
        const {id}= req.params;
        const posts =await Post.find({creator:id}).sort({createdAt: -1})
        res.status(200).json(posts)
    }catch(error){
        return next(new HttpError(error))
    }
}

//================================ Edit Post +++++=============================================
//Patch:api/posts/:id
//Protected
const editPost= async(req,res,next)=>{
    //res.json("edit post")
    try{
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        let{title,category,description}= req.body;
        if(!title || !category || description.length < 12){
            return next(new HttpError("fill all fields"))
        }

       
            //fet old post from database
            const oldPost = await Post.findById(postId);
            if(!req.files){
                updatedPost =await Post.findByIdAndUpdate(postId,{title,category,description},{new:true})
            }else{
            //delete old post from database
            fs.unlink(path.join(__dirname,'..','uploads',oldPost.thumbnail),async(err)=>{
                if(err){
                    return next(new HttpError(err))
                }
            })
                //upload new thumbnail
                const {thumbnail} = req.files;
                //check file sizw
                if(thumbnail.size >2000000){
                    return next(new HttpError("thumbnail is too big make it shorter"))
                }
                fileName = thumbnail.name;
                let splittedFilename = fileName.split('.')
                newFilename = splittedFilename[0] + uuid()+ "." + splittedFilename[splittedFilename.length -1]
                thumbnail.mv(path.join(__dirname,'..','uploads',newFilename),async(err)=>{
                    if(err){
                        return next(new HttpError(err))
                    }
                })
            updatedPost = await Post.findByIdAndUpdate(postId,{title,category,description,thumbnail:newFilename},{new:true})
        }
        if(!updatedPost){
            return next(new HttpError("couldn't update post",400))
        }
        res.status(200).json(updatedPost)
    }catch(error){
        return next(new HttpError(error))
    }

}

//================================ Delete Post +++++=============================================
//Delete:api/posts/:id
//Protected
const deletePost= async(req,res,next)=>{
    //res.json("delete post")
    try{
        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("Post unavailabe",400))
        }
        const post = await Post.findById(postId)
        const fileName = post?.thumbnail;
        
        //delete thumbnail from uploads
        fs.unlink(path.join(__dirname,'..','uploads',fileName),async(err)=>{
           if(err){
            return next(new HttpError(err))
           }else{
            await Post.findByIdAndDelete(postId);
            //find user and reduce the post count
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts -1;
            await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})
           
           }
        })
        res.json(`post ${postId}deleted successfully`)
    }catch(error){
        return next(new HttpError(error))
    }   
 
}

module.exports={createPost,getCatPosts,getPost,getPosts,getUserPosts,editPost,deletePost}



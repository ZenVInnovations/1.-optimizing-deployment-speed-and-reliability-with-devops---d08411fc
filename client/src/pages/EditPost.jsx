/*import React, { useState ,useContext,useEffect} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {UserContext} from '../context/userContext'
import {useNavigate ,useParams} from 'react-router-dom'
import axios from 'axios'

const EditPost = () => {
  const [title,setTitle]=useState('')
const[category,setCategory]=useState('Uncatergorized')
const [description,setDescription]=useState('')
const [thumbnail,setThumbnail] =useState('')
const [error,setErorr] = useState('')

const navigate = useNavigate();
const {id} = useParams();

const {currentUser} = useContext(UserContext)
const token = currentUser?.token;
//redirect to login page for any user who isnt logged in
useEffect(()=>{
  if(!token){
  navigate('/login')
  }
},[])

const modules={
  toolbar:[
    [{'header':[1,2,3,4,5,6,false]}],
    ['bold','italic','underline','strike','blockquote'],
    [{'list':'ordered'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'}],
    ['link','image'],
    ['clean']
  ]
}
const formats=[
  'header',
  'bold','italic','underline','strike','blockquote',
  'list','bullet','indent',
  'link','image'
]
const POST_CATEGORIES=["Agriculture","SmallScaleBusiness","Education",
  "SmallScaleBusiness","DairyManagement","Investment","ServiceandRepair","CropManagement","Uncategorized"]
 
  useEffect(()=>{
    const getPost = async()=>{
      try{
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setTitle(response.data.title)
        setDescription(response.data.description)
        
      }catch(err){

      }
    }
    getPost();
  },[])



  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
      {error && <p className="form__error-message">{error}</p>}
        <form className="form create-post__form" >
          <input type="text" placeholder='Title' value={title} onChange={e=> setTitle(e.target.value)}autoFocus/>
          <select name="category" value={category} onChange={e=> setCategory(e.target.value)}>
          {
            POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
          }
          
          
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription}/>
          <input type="file" onChange={e=> setThumbnail(e.target.files[0])} accept='png,jpg,jpeg'/>
          <button type="submit" className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  )
}

export default EditPost*/





// import axios from 'axios'
// import React, { useContext, useEffect, useState } from 'react'
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
// import { useNavigate } from 'react-router-dom'
// import { UserContext } from '../context/userContext'

// const CreatePost = () => {
//   const [title, setTitle] = useState('')
//   const [category, setCategory] = useState('Uncategorized')
//   const [description, setDescription] = useState('')
//   const [thumbnail, setThumbnail] = useState('')
//   const [error, setError] = useState('')
//   const navigate = useNavigate()

//   const { currentUser } = useContext(UserContext)
//   const token = currentUser?.token

//   useEffect(() => {
//     if (!token) {
//       navigate('/login')
//     }
//   }, [token, navigate])

//   const modules = {
//     toolbar: [
//       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//       [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
//       ['link', 'image'],
//       ['clean']
//     ]
//   }

//   const formats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike', 'blockquote',
//     'list', 'bullet', 'indent',
//     'link', 'image'
//   ]

//   const POST_CATEGORIES = [
//     "Agriculture", "SmallScaleBusiness", "Education", "DairyManagement", "Investment",
//     "Uncategorized", "ServiceandRepair", "CropManagement"
//   ]

//   const createPost = async (e) => {
//     e.preventDefault()
//     const postData = new FormData()
//     postData.set('title', title)
//     postData.set('category', category)
//     postData.set('description', description)
//     postData.set('thumbnail', thumbnail)

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, postData, {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       if (response.status === 201) {
//         return navigate('/')
//       }
//     } catch (err) {
//       if (err.response) {
//         setError(err.response.data.message)
//       } else {
//         setError('An error occurred. Please try again.')
//       }
//     }
//   }

//   return (
//     <section className="create-post">
//       <div className="container">
//         <h2>Create Post</h2>
//         {error && <p className="form_error-message">{error}</p>}
//         <form className="form create-post__form" onSubmit={createPost}>
//           <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
//           <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
//             {POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
//           </select>
//           <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
//           <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept='image/png, image/jpg, image/jpeg' />
//           <button type="submit" className='btn primary'>Create</button>
//         </form>
//       </div>
//     </section>
//   )
// }

// export default CreatePost;


import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate ,useParams} from 'react-router-dom';
import { UserContext } from '../context/userContext';



const EditPost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const{id} = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const POST_CATEGORIES = [
    "Agriculture", "SmallScaleBusiness", "Education", "DairyManagement", "Investment",
    "Uncategorized", "ServiceandRepair", "CropManagement"
  ];

  useEffect(()=>{
    const getPost = async()=>{
      try{
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
      setTitle(response.data.title);
      setDescription(response.data.description);

      }catch(error){
      console.log(error)
      }
    }
    getPost();
  },[])

  const editPost = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);
    postData.set('thumbnail', thumbnail);

    // Log FormData entries
    for (let [key, value] of postData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: false,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        return navigate('/');
      }
    } catch (err) {
      if (err.response) {
        console.error('Response error:', err.response.data);
        setError(err.response.data.message);
      } else if (err.request) {
        console.error('Request error:', err.request);
        setError('No response received from the server.');
      } else {
        console.error('Error:', err.message);
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form_error-message">{error}</p>}
        <form className="form create-post__form" onSubmit={editPost}>
          <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept='image/png, image/jpg, image/jpeg' />
          <button type="submit" className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  );
}

export default EditPost;

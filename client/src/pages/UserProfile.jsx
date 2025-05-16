import React,{useState,useContext,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Avatar from '../images/mern-blog-assets-main/avatar15.jpg'
import { FaEdit } from 'react-icons/fa' ;
import { FaCheck } from 'react-icons/fa';
import {UserContext} from '../context/userContext'
import axios from 'axios'

const UserProfile = () => {
  const [avatar,setAvatar]=useState('')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')

  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  //redirect to login page for any user who isnt logged in
  useEffect(()=>{
    if(!token){
    navigate('/login');
    }
  },[]);

useEffect(()=>{
  const getUser = async()=>{
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`, {
      withCredentials: false,headers: { Authorization: `Bearer ${token}` }
    });
    const {name,email,avatar} =response.data;
    setName(name);
    setEmail(email);
    setAvatar(avatar);
  }
  getUser();
},[])



const changeAvatarHandler = async ()=>{
 try{
  const postData = new FormData();
  postData.set('avatar',avatar);
  const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {
    withCredentials: false,
    headers: { Authorization: `Bearer ${token}` }
  });
  setAvatar(response?.data.avatar)
 }catch(error){}
}


  return (
    <div>
      <section className="profile">
        <div className="container profile__container">
          <Link to={`/myposts/${currentUser.id}`} className='btn'>My Posts</Link>
          <div className="profile__details">
            <div className="avatar_wrapper">
              <div className="profile__avatar">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="" />
              </div>
              <form className='avatar_form'>
               <input type="file" name="avatar" id="avatar" onChange={e=>setAvatar(e.target.files[0])}
                 accept="png,jpg,jpeg" />
                </form>
                
            <button className="profile__avatar-btn" onClick={changeAvatarHandler}><FaCheck/></button>
          </div>
            <h1>{currentUser.name}</h1>
  <form  className="form profile_form">
    <p className='form__error-message'>This is error message</p>
    <input type="text" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)}/>
    <input type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)}/>
  
  </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserProfile

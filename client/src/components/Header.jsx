import React, { useState ,useContext} from 'react'
import {Link} from 'react-router-dom'
//import Logo from '../images/mern-blog-assets-main/mainlogo.jpg'
import {FaBars} from "react-icons/fa"
import {AiOutlineClose} from "react-icons/ai"
import { UserContext } from '../context/userContext'
//<img src={Logo} alt="Navbar logo"/>

const Header = () => {
const[isNavShowing ,setIsNavShowing]=useState(window.innerWidth>800?true:false);
const {currentUser} = useContext(UserContext)



  const closeNavHandler=()=>{
    if(window.innerWidth < 800){
      setIsNavShowing(false)
    }else{
      setIsNavShowing(true)
    }
  }
  return (
   <nav>
    <div className="container nav__container">
    
       {currentUser?.id && isNavShowing && <ul className="nav__menu">
        <li><Link to ="/">HOME</Link></li>
          <li><Link to ={`/profile/${currentUser?.id}`} onClick={closeNavHandler}>{currentUser?.name}</Link></li>
            <li><Link to ="/create" onClick={closeNavHandler}>CreatePost</Link></li>
            <li><Link to ="/authors" onClick={closeNavHandler}>Authors</Link></li>
            <li><Link to ="/logout" onClick={closeNavHandler}>Logout</Link></li>
           
        </ul>}
        {!currentUser?.id && isNavShowing && <ul className="nav__menu">
            <li><Link to ="/authors" onClick={closeNavHandler}>Ideas of requirment</Link></li>
            <li><Link to ="/login" onClick={closeNavHandler}>Login</Link></li>
           
        </ul>}
        <button className="nav__toggle_btn" onClick={()=>setIsNavShowing(!isNavShowing)}>
         { isNavShowing ? <AiOutlineClose/>:<FaBars/>}

        </button>
    </div>
   </nav>
  )
}

export default Header

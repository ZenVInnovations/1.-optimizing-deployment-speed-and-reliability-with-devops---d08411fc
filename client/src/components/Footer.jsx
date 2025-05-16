import React from 'react'
import {Link} from 'react-router-dom'
const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link to="/posts/categories/Agriculture">Agriculture</Link></li>
        <li><Link to="/posts/categories/SmallScaleBusiness">SmallScaleBusiness</Link></li>
        <li><Link to="/posts/categories/Education">Education</Link></li>
        <li><Link to="/posts/categories/DairyManagement">DairyManagement</Link></li>
        <li><Link to="/posts/categories/Investment">Investment</Link></li>
        <li><Link to="/posts/categories/Uncategorized">Uncategorized</Link></li>
        <li><Link to="/posts/categories/ServiceandRepair">ServiceandRepair</Link></li>
        <li><Link to="/posts/categories/CropManagement">CropManagement</Link></li>
      </ul>
      <div className="footer__copyright">
        <small>All rights Reserved &copy; Copyright,DE</small>
      </div>
    </footer>
  )
}

export default Footer

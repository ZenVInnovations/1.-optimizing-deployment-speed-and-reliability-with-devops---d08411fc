import React from 'react'
import {Link} from 'react-router-dom'
const ErrorPage = () => {
  return (
<section className='error-page'>
<div className='center'>
<Link to="/" className='btn-primary'>GO BACK HOME</Link>
<h2>Page Not FOUND 404 error</h2>
</div>
</section>
  )
}

export default ErrorPage
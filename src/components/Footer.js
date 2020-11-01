import React from 'react'
import { Link } from 'gatsby'

import logo from '../img/logo.svg'
//import facebook from '../img/social/facebook.svg'
//import instagram from '../img/social/instagram.svg'
//import twitter from '../img/social/twitter.svg'
//import vimeo from '../img/social/vimeo.svg'
import github from '../img/github-icon.svg'

const Footer = class extends React.Component {
  render() {
    return (
      <footer className="container py-5">
	  <div className="content has-text-centered">
	  	<p>&copy; 2020 Frigid Media LLC <a href="/privacy-policy">Privacy Policy</a> <a href="/terms-of-service">Terms of Service</a></p>
	</div>
	  </footer>
    )
  }
}

export default Footer

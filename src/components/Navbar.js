import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      navBarActiveClass: '',
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
              navBarActiveClass: 'is-active',
            })
          : this.setState({
              navBarActiveClass: '',
            })
      }
    )
  }

  render() {
    return (
		<nav className="navbar sticky-top navbar-expand-lg bg-dark navbar-dark">
    	<div className="container" style={{minHeight: 0}}>
    		<a className="navbar-brand" style={{minHeight: 0, paddingTop: 0}} href="/">
    		<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-house" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
      <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
    </svg>
			<span style={{fontSize:'1rem', paddingLeft:'1em'}}>Matt Curcio</span>
    		</a>
    		<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    			<span className="navbar-toggler-icon"></span>
    		</button>
    		<div className="collapse navbar-collapse" id="navbarText">
    			<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
    				{/*}<li className="nav-item active">
    					<a className="nav-link" href="/posts">Blog <span className="sr-only">(current)</span></a>
    				</li>*/}
    			</ul>
				<ul className="navbar-nav ml-auto">
		            <li className="nav-item">
		                <a className="nav-link" href="https://github.com/mcurcio">
							<FontAwesomeIcon icon={faGithub} />
						</a>
		            </li>
					<li className="nav-item">
						<a class="nav-link" href="https://linkedin.com/in/curciomatt">
							<FontAwesomeIcon icon={faLinkedin} />
						</a>
					</li>
					<li className="nav-item">
						<a class="nav-link" href="https://twitter.com/_mcurcio">
							<FontAwesomeIcon icon={faTwitter} />
						</a>
					</li>
		        </ul>
    		</div>
    	</div>
    	</nav>
    )
  }
}

export default Navbar

import React, { Component } from 'react'
import Facebook from './facebook'
import Stripe from './stripe'

class Container extends Component {
  constructor (props) {
    super(props)
    this.handleFacebookLogin = this.onFacebookLogin.bind(this);
  }

  componentDidMount () {}

  render () {
    return <div>
      <Facebook onLogin={this.handleFacebookLogin} />
      <Stripe />
    </div>
  }

  onFacebookLogin () {
    this.setState({
      loggedIn: true
    })
  }
}

export default Container

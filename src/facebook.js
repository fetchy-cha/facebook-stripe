/*global FB*/
import axios from 'axios'
import React, { Component } from 'react'

function FetchyButton (props) {
  return <button onClick={props.onClick}> {props.text} </button>
}

function FetchyTextArea (props) {
  return <textarea rows='4' cols='80' value={props.text} readOnly />
}

function FetchyDashboard (props) {
  return <div>
    <div id="fb_user_id">{props.socialId}</div>
    <div id="email">{props.socialEmail}</div>
    Facebook Token:<br />
    <FetchyTextArea text={props.socialToken} />
    <br />
    <br />
  </div>
}

class Facebook extends Component {
  constructor (props) {
    super(props)
    this.parentCallback = props.onLogin
    this.state = { 
      fbLoggedIn: false,
      fetchyLoggedIn: false
    }
  }

  componentDidMount () {
    (function (d, s, id) {
      var js = d.getElementsByTagName(s)[0]
      var fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))

    window.fbAsyncInit = function () {
      FB.init({
        appId: '144968792678469',
        version: 'v2.8',
        xfbml: true // parse social plugins on this page
      })
      FB.getLoginStatus(function (response) {
        this.statusChangeCallback(response)
      }.bind(this))
    }.bind(this)
  }

  statusChangeCallback (response) {
    if (response.status === 'connected') {
    // Logged into your app and Facebook.
      this.setState({ fbLoggedIn: true })
      this.fetchBasicProfile()
    } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
      this.setState({ fbLoggedIn: false })
    } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
      this.setState({ fbLoggedIn: false })
    }
  }

  facebookLogin () {
    FB.login(function (response) {
      this.setState({
        socialToken: response.authResponse.accessToken
      })
      this.statusChangeCallback(response)
    }.bind(this), { scope: 'public_profile,email' })
  }

  fetchBasicProfile () {
    FB.api('/me', function (response) {
      this.setState({
        socialId: response.id
      })
      this.fetchProfile()
    }.bind(this))
  }

  fetchProfile () {
    FB.api('/' + this.state.socialId, { fields: 'email' },
      function (response) {
        this.setState({
          socialEmail: response.email
        })
        this.fetchyConnect()
      }.bind(this))
  }

  fetchyConnect () {
    axios({
      url: 'https://fetchy-demo.herokuapp.com/v1/user/account',
      method: 'post',
      auth: {
        username: this.state.socialEmail,
        password: this.state.socialToken
      },
      params: {
        social_id: this.state.socialId
      }
    })
    .then(response => {
      this.setState({
        fetchyUUID: response.data.uuid,
        fetchyToken: response.data.token,
        stripeCustomerId: response.data.stripe_id,
        fetchyLoggedIn: true
      })
    }).catch(error => {
      if (error.response.data.error === 'account already taken') {
        this.fetchyLogin()
      }
      else {
        console.log(error.response.data)
      }
    })
  }

  fetchyLogin () {
    axios({
      url: 'https://fetchy-demo.herokuapp.com/v1/user/session',
      method: 'get',
      auth: {
        username: this.state.socialEmail,
        password: this.state.socialToken
      },
      params: {
        social_id: this.state.socialId
      }
    })
    .then(response => {
      console.log(response.data)
      this.setState({
        fetchyUUID: response.data.uuid,
        fetchyToken: response.data.token,
        stripeCustomerId: response.data.stripe_id,
        fetchyLoggedIn: true
      })
    }).catch(error => {
      console.log(error.response.data)
    })
  }

  render () {
    const isFBLoggedIn = this.state.fbLoggedIn
    const isFetchyLoggedIn = this.state.fetchyLoggedIn
    if (!isFBLoggedIn) {
      return <FetchyButton onClick={this.facebookLogin.bind(this)} text='Login with Facebook' />
    } else if (isFBLoggedIn && !isFetchyLoggedIn) {
      return <div>Loading...</div>
    } else {
      return <div >
        <FetchyDashboard
          socialId={this.state.socialId}
          socialEmail={this.state.socialEmail}
          socialToken={this.state.socialToken} />
        <div>Stripe ID: {this.state.stripeCustomerId}</div>
        <div>Fetchy UUID: {this.state.fetchyUUID}</div>
        Fetchy Token:<br />
        <FetchyTextArea text={this.state.fetchyToken} />
      </div>
    }
  }
}

export default Facebook

import React, { Component } from 'react'
import Facebook from './facebook'
import StripeDashboard from './stripe'

class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {stripeId: null}
    this.onFetchyLogin = this.onFetchyLogin.bind(this)
  }

  componentDidMount () {}

  render () {
    var components = []
    components.push(<Facebook onLogin={this.onFetchyLogin} key={0} />)
    if (this.state.stripeId) {
      components.push(<div key={1}>-------------------------------<br /></div>)
      components.push(<StripeDashboard stripeId={this.state.stripeId} key={2} />)
    }

    return <div> {components} </div>
  }

  onFetchyLogin (stripeCustomerId) {
    this.setState({
      stripeId: stripeCustomerId
    })
  }
}

export default Container

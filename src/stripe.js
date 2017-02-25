import React, { Component } from 'react'

function StripeCardList (props) {
  var components = []
  for (var i = 0; i < props.cards.length; i++) {
    var card = props.cards[i]
    components.push(<StripeCard brand={card.brand} last4={card.last4} />)
  }

  return <div>
    <strong>Your Cards:</strong><br />
    {components}
  </div>
}

function StripeCard (props) {
  return <div><strong>{props.brand}</strong> ** {props.last4}<br /></div>
}

function StripeForm (props) {
  return <div>
    <form action='/charge' method='post' id='payment-form'>
      <div className='form-row'>
        <label>
          Credit or debit card
        </label>
        <div id='card-element' />
        <div id='card-errors' />
      </div>

      <button>Submit Payment</button>
    </form>
  </div>
}

class StripeDashboard extends Component {
  constructor (props) {
    super(props)
    console.log(this.props.stripeId)
    this.state = {stripeId: this.props.stripeId}
    this.handleCCNumberChange = this.handleCCNumberChange.bind(this)
  }

  componentDidMount () { }

  render () {
    if (this.state.stripeId === null) {
      return null
    } else {
      return <div>
        <StripeCardList cards={[]} />
        <StripeForm elements={this.elements} />
      </div>
    }
  }

  handleCCNumberChange (event) {
    console.log(event.target.value)
    this.setState({
      ccNumber: event.target.value
    })
  }

  handleAddCard () {

  }
}

export default StripeDashboard

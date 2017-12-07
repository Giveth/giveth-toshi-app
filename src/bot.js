const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      welcome(session)
      break
  }
}

function onMessage(session, message) {
  session.reply("Thanks for your ear friend! If you have any questions, please join us at slack.giveth.io and ask away!") 
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'wallet':
      wallet(session)
      break
    case 'donate':
      donate(session)
      break
    case 'social':
      social(session)
      break		  
    }
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the donation! 🙏 We run off of donations, and without people like you we would not be able to help the world be a better place.`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your donation!🚫`);
    }
  }
}

// STATES

function welcome(session) {
  sendMessage(session, `Thanks for following Giveth! Stay tuned for more information about our platform! You can always find us on our Slack at slack.giveth.io`)
}

function wallet(session) {
  sendMessage(session, `If you would like to get one of our governance tokens, you can donate to us at: revolution.eth`)
}


function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}



function social(session) {
  sendMessage(session, 'Facebook: https://www.facebook.com/givethio/')
  sendMessage(session, 'Twitter: https://www.twitter.com/givethio/')
  sendMessage(session, 'Slack: slack.giveth.io')
  sendMessage(session, 'Wiki: https://wiki.giveth.io')	

}
// HELPERS
function sendMessage(session, message) {
  session.reply(SOFA.Message({
   body: message,
  controls: [
    {
      type: "group",
      label: "Giveth Info",
      controls: [
        {type: "button", label: "Giveth Website", action: "Webview::https://giveth.io"},
        {type: "button", label: "Giveth Wallet", value: "wallet"},
        {type: "button", label: "Social Media", value: "social"},
        {type: "button", label: "Wiki", action: "Webview::https://wiki.giveth.io"}
      ]
    },
    {
      type: "group",
      label: "Our Dapp",
      "controls": [
        {type: "button", label: "Dapp alpha", action: "Webview::https://alpha.giveth.io"},
        {type: "button", label: "Support", action: "Webview::http://slack.giveth.io"},
        {type: "button", label: "Dapp", action: "Webview::http://dapp.giveth.io/#/"},
      ]
    }
  ]
}))

}

/**
 * # FormButton.js
 *
 * Display a button that responds to onPress and is colored appropriately
 */
'use strict'
/**
 * ## Imports
 *
 * React
 */
import React from 'react'
import
{
  StyleSheet,
  View
} from 'react-native'

/**
 * The platform neutral button
 */
const Button = require('apsl-react-native-button')

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  signin: {
    marginLeft: 10,
    marginRight: 10
  },
  button: {
    backgroundColor: '#1EC267',
    borderColor: '#1EC267'
  }

})

var FormButton = React.createClass({
  propTypes: {
     className: React.PropTypes.string,
     style: React.PropTypes.object
  },
  getDefaultProps: function() {
    return({ className: "", style: {} });
  },
  render () {
    return (
      <View style={styles.signin}>
        <Button style={styles.button}
          textStyle={{fontSize: 18, color: "#000080" }}
          isDisabled={this.props.isDisabled}
          onPress={this.props.onPress} >
          {this.props.buttonText}
        </Button>
      </View>
    )
  }
})

module.exports = FormButton

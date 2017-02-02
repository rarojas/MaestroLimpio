'use strict'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Dimensions from 'Dimensions'
var {height, width} = Dimensions.get('window')
var reactMixin = require('react-mixin')
import TimerMixin from 'react-timer-mixin'
import BackgroundImage  from '../components/BackgroundImage'
import React from 'react'
import
{
    StyleSheet,
    Text
}
from 'react-native'
import Styles from '../components/Styles'


function mapStateToProps (state) {
  return {
   }
};

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({  }, dispatch)
  }
}


let App = React.createClass({
  componentDidMount () {
      Actions.Main()
  },
  render () {
    return (
      <BackgroundImage isFetching={true}>
          <Text style={Styles.title}>
            Maestro Limpio
         </Text>
      </BackgroundImage>
    )
  }
})

reactMixin(App.prototype, TimerMixin)
export default connect(mapStateToProps, mapDispatchToProps)(App)

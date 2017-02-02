'use strict'
import React, { Component, PropTypes } from 'react';
import { View , StyleSheet} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import MenuItem  from '../components/MenuItem'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as globalActions from '../reducers/global/globalActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    padding: 5,
    marginTop : 0,
    backgroundColor: '#1EC267'
  }
})
function mapStateToProps (state) {
  return {
    global: {
      currentUser: state.global.currentUser,
      currentState: state.global.currentState,
      showState: state.global.showState
    }
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...globalActions }, dispatch)
  }
}

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: {
          name: ''
      }
    }
  }
  componentWillReceiveProps (props) {
  }
  componentDidMount () {
  }
  close() {
    SideMenu.drawer.close();
    Actions.Main();
  }
  static contextTypes = {
  		drawer: PropTypes.object.isRequired,
  }
  render() {
    const { drawer } = this.context
    SideMenu.drawer = drawer;
    let self = this
    let onButtonPress = () => {
      
    }
    return (
      <View style={styles.container}>
      <View style={{ flex: 6 }} >
        <MenuItem icon={"user"} onPress={this.close} text={(() => {return "Hola: " + this.state.user.name})()} ></MenuItem>
        <MenuItem icon={"user"} onPress={this.close} text={(() => {return "Farmacia"})()} ></MenuItem>
        <MenuItem icon={"user"} onPress={this.close} text={(() => {return "Receta" })()} ></MenuItem>
      </View>
      <View style={{ flex: 1 }}>
        <MenuItem icon={"sign-out"} onPress={onButtonPress.bind(self)} text={ "Cerrar Sesión"} ></MenuItem>
      </View>
     </View>
    );
  }
}
SideMenu.propTypes = {
	drawer: PropTypes.object
}
export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)

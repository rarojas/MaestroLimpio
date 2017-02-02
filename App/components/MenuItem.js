'use strict'
import React, { Component, PropTypes } from 'react';
import { View , StyleSheet, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
  titleContainer : {
        marginTop : 2,
       flexDirection: 'row',
       borderWidth: 1,
       borderColor: "#26ad60",
       borderRadius: 5
   },
   title  : {
       padding : 10,
       textAlignVertical: 'center',
       fontWeight:'bold',
       color   : 'white'
   },
   menuView : {
    flexDirection: 'row',
    padding    : 5
   },
   buttonImage : {
       padding : 5,
       color : "white",
       width : 40,
       height: 40,
       textAlign: 'center'
   },
})
class MenuItem extends Component {
  constructor(props) {
   super(props);
  }
  render() {
    return (
        <TouchableHighlight style={styles.titleContainer} onPress={this.props.onPress}  underlayColor={this.props.underlayColor}>
          <View style={styles.menuView} >
              <Icon style={styles.buttonImage} name={this.props.icon} size={this.props.size} />
              <Text style={styles.title}> {this.props.text }</Text>
            </View>
          </TouchableHighlight>
        );
    }
}
MenuItem.propTypes = {
  underlayColor: PropTypes.string,
	size  : PropTypes.number,
  icon : PropTypes.string,
  onPress : PropTypes.func,
  text : PropTypes.string
};
MenuItem.defaultProps = {
  underlayColor : "#26ad60",
  size : 30,
  text : ''
};
export default MenuItem

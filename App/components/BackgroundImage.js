import React, { PropTypes, Component } from 'react'
import { Image, StyleSheet,View,ActivityIndicator, Animated , Easing} from 'react-native'
import Styles from './Styles'
const defaultBackground = require('../img/Autolavado.jpg')
import cloneReferencedElement from 'react-clone-referenced-element';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
const onlyChild = React.Children.only;

let styles = StyleSheet.create({
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  placeholder: {
    backgroundColor: '#eee',
  },
});


class BackgroundImage extends Component {
  constructor(props) {
   super(props);
   this.state = {
      fadeAnim: new Animated.Value(1), // init opacity 0
    };
  }
  _onLoadEnd = () => {
      console.log("onload");
      const minimumWait = 100;
      const staggerNonce = 200 * Math.random();

      this.setTimeout(() => {
          Animated.timing(          // Uses easing functions
            this.state.fadeAnim,    // The value to drive
            {  toValue: 1,
              duration: 3000,
              easing: Easing.linear,
            }            // Configuration
          )
          //.start();
        }, minimumWait + staggerNonce);
  }
  componentDidMount() {

 }
	render() {
		return (
       <Animated.View style={[styles.placeholderContainer, {opacity: this.state.fadeAnim}]} >
    			<Image onLoadEnd={this._onLoadEnd} source={this.props.source} style={[Styles.bgImage, this.props.imageStyle]}>
              <View style={Styles.container}>
                  {this.props.isFetching
                   ? <ActivityIndicator animating size='large' style={Styles.centering} color="#fff"/>
                   : null
                  }
                {this.props.children}
              </View>
          </Image>
      </Animated.View>
		)
	}
}

reactMixin(BackgroundImage.prototype, TimerMixin);

BackgroundImage.propTypes = {
  isFetching: PropTypes.bool,
  children: React.PropTypes.node || React.PropTypes.nodes,
	source  : PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.object
	]),
	imageStyle: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.array,
		PropTypes.object
	]),
};
BackgroundImage.defaultProps = {
  source : defaultBackground,
  isFetching : false
};
export default BackgroundImage

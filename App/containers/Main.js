'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dimensions from 'Dimensions'
var {height, width} = Dimensions.get('window')
var reactMixin = require('react-mixin')
import TimerMixin from 'react-timer-mixin'
import BackgroundImage  from '../components/BackgroundImage'
import React from 'react'
import
{   View,
    StyleSheet,
    Text,
    Animated
}
from 'react-native'
import Styles from '../components/Styles'
import MapView from 'react-native-maps';
import CarWash  from '../components/CarWash'
const screen = Dimensions.get('window');
import PanController from '../components/PanController';

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = screen.width - (2 * ITEM_SPACING) - (2 * ITEM_PREVIEW);
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;
const SCALE_END = screen.width / ITEM_WIDTH;
const BREAKPOINT1 = 246;
const BREAKPOINT2 = 350;
const ONE = new Animated.Value(1);

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const defaultLatLng = { latitude: 19.435477, longitude: -99.136479}
const defaultOpts =  { latitudeDelta: 0.0922, longitudeDelta: 0.0922}
const DELTAMAX = 0.1000;
const DELTAANGLE = 0.2
const PI_2 = 3.1416 * 2
const MAX_AMOUNT = 2000


function getMarkerState(panX, panY, scrollY, i) {
  const xLeft = (-SNAP_WIDTH * i) + (SNAP_WIDTH / 2);
  const xRight = (-SNAP_WIDTH * i) - (SNAP_WIDTH / 2);
  const xPos = -SNAP_WIDTH * i;

  const isIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const isNotIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [1, 0, 0, 1],
    extrapolate: 'clamp',
  });

  const center = panX.interpolate({
    inputRange: [xPos - 10, xPos, xPos + 10],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const selected = panX.interpolate({
    inputRange: [xRight, xPos, xLeft],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const translateY = Animated.multiply(isIndex, panY);

  const translateX = panX;

  const anim = Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }));

  const scale = Animated.add(ONE, Animated.multiply(isIndex, scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, SCALE_END - 1],
    extrapolate: 'clamp',
  })));

  // [0 => 1]
  let opacity = scrollY.interpolate({
    inputRange: [BREAKPOINT1, BREAKPOINT2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // if i === index: [0 => 0]
  // if i !== index: [0 => 1]
  opacity = Animated.multiply(isNotIndex, opacity);


  // if i === index: [1 => 1]
  // if i !== index: [1 => 0]
  opacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  let markerOpacity = scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  markerOpacity = Animated.multiply(isNotIndex, markerOpacity).interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const markerScale = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return {
    translateY,
    translateX,
    scale,
    opacity,
    anim,
    center,
    selected,
    markerOpacity,
    markerScale,
  };
}

function mapStateToProps (state) {
  return {
   }
};

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({  }, dispatch)
  }
}

function generateElements(origin){
  var angle = 0// from 0 to 2 Pi
  var elementsArray = []
  var center = defaultLatLng;
  if(origin){
    center = origin;
  }
  var size = 0;
  while(angle < PI_2 ) {
    var element = { name : "Nombre", latlng : { ...center } }
    var deltaX = Math.sin(angle) * Math.random() * DELTAMAX;
    var deltaY = Math.cos(angle) * Math.random() * DELTAMAX;
    element.latlng.latitude += deltaX
    element.latlng.longitude += deltaY
    element.amount = Math.round(Math.random() * MAX_AMOUNT, 2)
    element.id = size;
    elementsArray.push(element);
    size++;
    angle += DELTAANGLE;
  }
  return elementsArray;
}




class Main extends React.Component {
  constructor(props) {
    super(props);
    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);

    const scrollY = panY.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scrollX = panX.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scale = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [1, 1.6],
      extrapolate: 'clamp',
    });

    const translateY = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [0, -100],
      extrapolate: 'clamp',
    });


    var elementsArray = generateElements();
    const animations = elementsArray.map((m, i) =>
      getMarkerState(panX, panY, scrollY, i));

    this.state = {
      panX,
      panY,
      animations,
      index: 0,
      canMoveHorizontal: true,
      scrollY,
      scrollX,
      scale,
      translateY,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      region: new MapView.AnimatedRegion({
        ...defaultLatLng,
        ...defaultOpts
      }),
      carWash : elementsArray
    }
  }

  onRegionChange(region) {
    //this.setState({ region });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  componentDidMount() {
    const { region, panX, panY, scrollX, carWash } = this.state;

    panX.addListener(this.onPanXChange);
    panY.addListener(this.onPanYChange);

    this.watchID = null;
    navigator.geolocation.getCurrentPosition(
       (position) => {
         var elementsArray = generateElements(position.coords);
         this.state.carWash = elementsArray;
         var initialPosition = JSON.stringify(position);
         this.state.initialPosition = initialPosition;
         this.state.region.latitude = position.coords.latitude | this.state.region.latitude
         this.state.region.longitude = position.coords.longitude | this.state.region.longitude

         region.stopAnimation();
         region.timing({
           latitude: scrollX.interpolate({
             inputRange: this.state.carWash.map((m, i) => i * SNAP_WIDTH),
             outputRange: this.state.carWash.map(m => m.latlng.latitude),
           }),
           longitude: scrollX.interpolate({
             inputRange: this.state.carWash.map((m, i) => i * SNAP_WIDTH),
             outputRange: this.state.carWash.map(m => m.latlng.longitude),
           }),
           duration: 0,
         }).start();
       },
       (error) => alert(JSON.stringify(error)),
       {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
     );
     this.watchID = navigator.geolocation.watchPosition((position) => {
       var elementsArray = generateElements(position.coords);
       var lastPosition = JSON.stringify(position);
       this.state.lastPosition = lastPosition;
       this.state.region.latitude = position.coords.latitude | this.state.region.latitude
       this.state.region.longitude = position.coords.longitude | this.state.region.longitude
     });
  }

    onStartShouldSetPanResponder = (e) => {
     // we only want to move the view if they are starting the gesture on top
     // of the view, so this calculates that and returns true if so. If we return
     // false, the gesture should get passed to the map view appropriately.
     const { panY } = this.state;
     const { pageY } = e.nativeEvent;
     const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
     const topOfTap = screen.height - pageY;

     return topOfTap < topOfMainWindow;
   }

   onMoveShouldSetPanResponder = (e) => {
     const { panY } = this.state;
     const { pageY } = e.nativeEvent;
     const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
     const topOfTap = screen.height - pageY;

     return topOfTap < topOfMainWindow;
   }

   onPanXChange = ({ value }) => {
     const { index } = this.state;
     const newIndex = Math.floor(((-1 * value) + (SNAP_WIDTH / 2)) / SNAP_WIDTH);
     if (index !== newIndex) {
       this.setState({ index: newIndex });
     }
   }

   onPanYChange = ({ value }) => {
     const { canMoveHorizontal, region, scrollY, scrollX, carWash, index } = this.state;
     const shouldBeMovable = Math.abs(value) < 2;
     if (shouldBeMovable !== canMoveHorizontal) {
       this.setState({ canMoveHorizontal: shouldBeMovable });
       if (!shouldBeMovable) {
         const  coordinate  = carWash[index]
         region.stopAnimation();
         region.timing({
            latitude: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [
                coordinate.latlng.latitude,
                coordinate.latlng.latitude - (LATITUDE_DELTA * 0.5 * 0.375),
              ],
              extrapolate: 'clamp',
            }),
            latitudeDelta: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [LATITUDE_DELTA, LATITUDE_DELTA * 0.5],
              extrapolate: 'clamp',
            }),
            longitudeDelta: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [LONGITUDE_DELTA, LONGITUDE_DELTA * 0.5],
              extrapolate: 'clamp',
            }),
            duration: 0,
          }).start();
       } else {
        region.stopAnimation();
        region.timing({
          latitude: scrollX.interpolate({
            inputRange: carWash.map((m, i) => i * SNAP_WIDTH),
            outputRange: carWash.map(m => m.latlng.latitude),
          }),
          longitude: scrollX.interpolate({
            inputRange: carWash.map((m, i) => i * SNAP_WIDTH),
            outputRange: carWash.map(m => m.latlng.longitude),
          }),
          duration: 0,
        }).start();
       }
     }
   }

  render () {
    const {
      panX,
      panY,
      animations,
      canMoveHorizontal,
      carWash,
      region,
    } = this.state;
    return (
      <BackgroundImage isFetching={false}>
         <View style ={styles.container}>
            <PanController
              style={styles.container}
              vertical
              horizontal={canMoveHorizontal}
              xMode="snap"
              snapSpacingX={SNAP_WIDTH}
              yBounds={[-1 * screen.height, 0]}
              xBounds={[-screen.width * (carWash.length - 1), 0]}
              panY={panY}
              panX={panX}
              onStartShouldSetPanResponder={this.onStartShouldSetPanResponder}
              onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}
            >
            <MapView.Animated
              provider={this.props.provider}
              showsUserLocation={true} followsUserLocation={true}
              showsMyLocationButton={true}
              style={styles.map}
              region={this.state.region}
              onRegionChange={this.onRegionChange} >
              { this.state.carWash.map((marker, i)  => {
                const {
                   selected,
                   markerOpacity,
                   markerScale,
                 } = animations[i];
                  return (
                   <MapView.Marker
                     coordinate={marker.latlng}
                     title={marker.name}
                     key={marker.id}
                     description={JSON.stringify(marker.latlng)} >
                     <CarWash amount={marker.amount} selected={{true}}
                     style={{
                        opacity: markerOpacity,
                        transform: [
                          { scale: markerScale },
                        ],
                      }} />
                  </MapView.Marker>)
               })
             }
            </MapView.Animated>
            <View style={styles.itemContainer}>
               {
                 this.state.carWash.map((marker, i) => {
                   const {
                    translateY,
                    translateX,
                    scale,
                    opacity,
                  } = animations[i];
                 return (
                   <Animated.View
                    key={marker.id}
                    style={[styles.item, {
                    opacity,
                    transform: [
                      { translateY },
                      { translateX },
                      { scale },
                    ],
                    }]} >
                    <Text> {marker.name} </Text>
                    <Text> ${marker.amount} </Text>
                    <Text> {marker.latlng.latitude} </Text>
                    <Text> {marker.latlng.longitude} </Text>
                   </Animated.View>
                 );
               })}
             </View>
           </PanController>
        </View>
      </BackgroundImage>
    )
  }
}

Main.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
 },
 title: {
   color:"black"
 },
 map: {
     ...StyleSheet.absoluteFillObject,

 },
 item: {
   width: ITEM_WIDTH,
   height: screen.height + (2 * ITEM_PREVIEW_HEIGHT),
   backgroundColor: 'red',
   marginHorizontal: ITEM_SPACING / 2,
   overflow: 'hidden',
   borderRadius: 3,
   borderColor: '#000',
   alignItems:"center",
 },
 itemContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: (ITEM_SPACING / 2) + ITEM_PREVIEW,
    position: 'absolute',
    // top: screen.height - ITEM_PREVIEW_HEIGHT - 64,
    paddingTop: screen.height - ITEM_PREVIEW_HEIGHT - 64,
    // paddingTop: !ANDROID ? 0 : screen.height - ITEM_PREVIEW_HEIGHT - 64,
  },
});

reactMixin(Main.prototype, TimerMixin)
export default connect(mapStateToProps, mapDispatchToProps)(Main)

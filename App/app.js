'use strict'

import React from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    Text } from 'react-native'

import {  Router,  Scene} from 'react-native-router-flux'

import { Provider} from 'react-redux'

import configureStore from './lib/configureStore'

import {setStore} from './reducers/global/globalActions'

import GlobalInitialState from './reducers/global/globalInitialState'


function getInitialState () {
  const _initState = {
    global: (new GlobalInitialState()),
  }
  return _initState
}


const styles = StyleSheet.create({
  tabBar: {
    height: 60
  }
})

import Drawer from './containers/NavDrawer';


import Icon from 'react-native-vector-icons/FontAwesome'

import App from './containers/App'
import Main from './containers/Main'
import { Actions } from 'react-native-router-flux'


const getSceneStyle = ( props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 40;
    style.marginBottom = computedProps.hideTabBar ? 0 : 0;
  }
  return style;
};


var t = require('tcomb-form-native')
export const store = configureStore();

export default function native(platform) {
  t.form.Form.stylesheet.textbox.normal.backgroundColor = 'white';
  t.form.Form.stylesheet.controlLabel.normal.color = '#000080';

  let MaestroLimpio = React.createClass({
    render () {
      //const store = configureStore(getInitialState())
      //store.dispatch(setStore(store))
      return (
        <Provider store={store} >
          <Router sceneStyle={{ backgroundColor: 'white' }} getSceneStyle={getSceneStyle}
            navigationBarStyle={{backgroundColor: 'white'}}  titleStyle={{color : "#FFF"}}>
            <Scene key="drawer" component={Drawer} open={false} >
                <Scene key='root' >
                  <Scene key='App'
                    component={App}
                    hideNavBar
                    type='replace'
                    initial />
                  <Scene key='Main'
                    component={Main}
                    hideNavBar
                    type='replace'
                    />
                </Scene>
            </Scene>
          </Router>
        </Provider>
      )
    }
  })

  AppRegistry.registerComponent('MaestroLimpio', () => MaestroLimpio)
}

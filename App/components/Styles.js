import { StyleSheet } from 'react-native'


const Styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 20,
  },
  bgImage: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'cover'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: "transparent",
      textAlign:"center",
      color:"#fff"
  },
})

export default Styles

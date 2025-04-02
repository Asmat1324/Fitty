import React, { useContext }from 'react';
import { View, StyleSheet, Text, Image} from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import HomeCard from '../components/HomeCard';
import { AuthContext } from '../utilities/authContext';
const HomeScreen = () => {
  const { user } = useContext(AuthContext);

  if (user) {
   console.log(user.profilePicture);
  }


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profPicPad}>
                <Image source={{ uri: `http://192.168.1.70:19000/uploads/${user.profilePicture}` }} style={styles.profPicImage} />
                </View>
        <HomeCard />
        <Text>Welcome, <Text>{user.firstname}</Text> <Text>{user.lastname}</Text></Text>
        {/* <Button mode="contained" style={styles.button} onPress={() => console.log('Track Workouts')}>
          Track Workouts
          
        </Button> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  content: {
    padding: 2,
  },
  button: {
    marginTop: 2,
  },
  profPicImage: {
    width: 100, 
    height: 100,
    backgroundColor: '#A999',
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 50,  
    marginTop: 10,
  },
  profPicPad: {
    backgroundColor: '#2E6F75',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingTop: -2,
    paddingBottom: 10,
    width: '30%',  
    marginBottom: -10,
    alignItems: 'center',  
    justifyContent: 'center',
  },
});

export default HomeScreen;
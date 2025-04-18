
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
//Screens
import WorkoutScreen from './WorkoutScreen';
import WorkoutTrackerScreen from './WorkoutTrackerScreen';


const workoutGenerator = 'Workout Generator';
const workoutTracker = 'Workout Tracker';
//Creating top tab navigator
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();


const TrackerContainer = () => {
 return (
    
    // <Tab.Navigator
   
    // lazy={true}
    // initialRouteName={calorieTracker}
    // screenOptions={({route}) => ({
    //     tabBarIcon: ({ focused, color, size}) => {
    //       let iconName;
    //       let rn = route.name;
          
    //       if (rn === calorieTracker){
    //         iconName = focused ? 'leaf' : 'leaf-outline';
    //       }
    //       else if (rn === workoutTracker) {
    //         iconName = focused ? 'barbell' : 'barbell-outline';
    //       }
    //       return <Ionicons name={iconName} size={size} color={color} />;
    //     },
    // })}
    // >
   
       
         <Tab.Navigator>
         <Tab.Screen name="Workout Generator" component={WorkoutScreen} />
         <Tab.Screen name="Workout Tracker" component={WorkoutTrackerScreen} />
         </Tab.Navigator>
   
  
    // </Tab.Navigator>
  );
}

export default TrackerContainer;

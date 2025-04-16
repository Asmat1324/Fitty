
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
//Screens
import TrackerScreen from './TrackerScreen';
import MealScreen from './MealScreen';


const calorieTracker = 'Meal Tracker';
const mealGenerator = 'Meal Generator';
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
          <Tab.Screen name="Meal Generator" component={MealScreen} />
         <Tab.Screen name="Meal Tracker" component={TrackerScreen} />
         </Tab.Navigator>
   
  
    // </Tab.Navigator>
  );
}

export default TrackerContainer;

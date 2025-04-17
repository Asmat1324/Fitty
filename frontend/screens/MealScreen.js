import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ExerciseCard from "../components/ExerciseCard";
import {useTheme} from '../utilities/ThemeContext';

const MealScreen = ({ navigation }) => {
  const [bodyPart, setBodyPart] = useState("back");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exerciseData, setExerciseData] = useState([]);
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const categories = [
    "back",
    "cardio",
    "chest",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist",
  ];

  const fetchExercises = async () => {
    setLoading(true);
    setError("");

    try {
      const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
      console.log(url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": "a33b2cb2cemshfbaf09bafc96095p1f66acjsne7d61b9b41b2",
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      });

      const data = await response.json();
      if (data && data.length > 0) {
        setExerciseData(data);
      } else {
        setError("No exercises found. Try again.");
      }
    } catch (error) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.select}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.selectText}>{bodyPart.toUpperCase()}</Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.dropdownItem}
              onPress={() => {
                setBodyPart(category);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={fetchExercises}>
        <Text style={styles.buttonText}>Fetch Meals</Text>
      </TouchableOpacity>
      <FlatList
        data={exerciseData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExerciseCard data={item} />}
      />
      {loading && <ActivityIndicator size="large" color="#48E0E4" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    select: {
      backgroundColor: theme.background,
      borderColor: theme.text,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    selectText: {
      fontSize: 16,
      color: theme.text,
    },
    dropdown: {
      backgroundColor: "#fff",
      borderRadius: 8,
      marginTop: 5,
    },
    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    dropdownText: {
      fontSize: 16,
      color: "#000",
    },
    button: {
      backgroundColor: theme.buttonColor,
      borderRadius: 20,
      padding: 12,
      alignItems: "center",
      marginTop: 20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    errorText: {
      color: "#FF4D4D",
      textAlign: "center",
      fontSize: 12,
      marginTop: 10,
    },
  });

export default MealScreen;

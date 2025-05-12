import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ExerciseCard from "../components/ExerciseCard";
import { useTheme } from '../utilities/ThemeContext';

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

const WorkoutScreen = () => {
  const [bodyPart, setBodyPart] = useState("back");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exerciseData, setExerciseData] = useState([]);
  const { theme } = useTheme();

  const styles = useMemo(() => getStyles(theme), [theme]);

  useEffect(() => {
    fetchExercises();
  }, [bodyPart]);

  const fetchExercises = async () => {
    setLoading(true);
    setError("");

    try {
      const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
      const response = await fetch(url, {
        headers: {
          "x-rapidapi-key": "a33b2cb2cemshfbaf09bafc96095p1f66acjsne7d61b9b41b2",
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      });

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setExerciseData(data);
      } else {
        setExerciseData([]);
        setError("No exercises found.");
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
              <Text style={styles.dropdownText}>{category.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={fetchExercises}>
        <Text style={styles.buttonText}>Refresh Exercises</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size={40} color={theme.primary} />}

      {!loading && exerciseData.length > 0 && (
        <FlatList
          data={exerciseData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExerciseCard data={item} />}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    select: {
      backgroundColor: theme.card,
      borderColor: theme.border,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    selectText: {
      fontSize: 18,
      color: theme.text,
      textAlign: 'center',
      fontWeight: '600',
    },
    dropdown: {
      backgroundColor: theme.card,
      borderRadius: 8,
      marginTop: 5,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dropdownItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.text,
    },
    button: {
      backgroundColor: theme.buttonColor,
      borderRadius: 20,
      padding: 12,
      alignItems: "center",
      marginVertical: 20,
      elevation: 3,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    errorText: {
      color: theme.error,
      textAlign: "center",
      fontSize: 14,
      marginTop: 10,
    },
  });

export default WorkoutScreen;

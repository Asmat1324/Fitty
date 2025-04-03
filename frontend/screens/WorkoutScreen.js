import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,  
  TouchableOpacity 
} from "react-native";
import { Appbar, Button } from "react-native-paper";
import ExerciseCard from "../components/ExerciseCard"; // Make sure this path matches your folder structure exactly

const WorkoutScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exerciseData, setExerciseData] = useState([]);

  const fetchExercises = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://exercisedb.p.rapidapi.com/exercises", {
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.button} onPress={fetchExercises}>
        <Text style={styles.buttonText}>Fetch Exercises</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#48E0E4" />}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exerciseData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExerciseCard data={item} />}
        ListHeaderComponent={renderHeader} 
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: "#48E0E4",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
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
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default WorkoutScreen;

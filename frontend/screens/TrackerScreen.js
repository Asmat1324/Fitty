import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Appbar } from "react-native-paper";

const TrackerScreen = ({ navigation }) => {
  const [food, setFood] = useState("");
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNutritionData = async () => {
    if (!food) return;

    setLoading(true);
    setError("");
    setNutritionData(null);

    try {
      const response = await fetch(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-app-id": "6d574f12",
            "x-app-key": "89e747052e54184b1e557825dc0884fc",
          },
          body: JSON.stringify({ query: food }),
        }
      );

      const data = await response.json();

      if (data.foods && data.foods.length > 0) {
        const totalCalories = data.foods.reduce(
          (sum, item) => sum + item.nf_calories,
          0
        );
        setNutritionData({ foods: data.foods, totalCalories });
      } else {
        setError("No nutrition data found. Try another item.");
      }
    } catch (error) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#000" }}>
        <Appbar.Content
          title="Calorie Calculator"
          titleStyle={styles.buttonText}
        />
      </Appbar.Header>

      <Text style={styles.title}>Enter Food Item:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 1 apple, 2 eggs"
        placeholderTextColor="#aaa"
        value={food}
        onChangeText={setFood}
      />

      <TouchableOpacity style={styles.button} onPress={fetchNutritionData}>
        <Text style={styles.buttonText}>Get Nutrition Info</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#48E0E4" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {nutritionData && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>
            Total Calories: {nutritionData.totalCalories} kcal
          </Text>
          {nutritionData.foods.map((item, index) => (
            <View key={index}>
              <Text style={styles.resultText}>
                🍎 {item.food_name} - {item.nf_calories} kcal
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#2E6F75",
    color: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    textAlign: "center",
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
  error: {
    color: "#FF4D4D",
    textAlign: "center",
    fontSize: 12,
    marginBottom: 10,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TrackerScreen;

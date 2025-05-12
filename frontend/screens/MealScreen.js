import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useTheme } from '../utilities/ThemeContext';

const MealScreen = () => {
  const [category, setCategory] = useState("Seafood");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mealData, setMealData] = useState([]);
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const categories = [
    "Seafood",
    "Beef",
    "Chicken",
    "Dessert",
    "Pasta",
    "Vegetarian",
    "Vegan",
    "Breakfast",
    "Lamb",
  ];

  const fetchMeals = async () => {
    setLoading(true);
    setError("");
    setMealData([]);

    try {
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.meals) {
        setMealData(data.meals);
      } else {
        setError("No meals found. Try a different category.");
      }
    } catch (error) {
      setError("Error fetching meals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meal Generator</Text>

      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && styles.categoryButtonActive,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.fetchButton} onPress={fetchMeals}>
        <Text style={styles.fetchButtonText}>Get {category} Meals</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size={40} color={theme.primary} />}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={mealData}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
            <Text style={styles.mealName}>{item.strMeal}</Text>
          </View>
        )}
      />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 20,
    },
    categoryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 15,
    },
    categoryButton: {
      backgroundColor: theme.card,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      margin: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryButtonActive: {
      backgroundColor: theme.primary,
    },
    categoryText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "600",
    },
    fetchButton: {
      backgroundColor: theme.buttonColor,
      padding: 12,
      borderRadius: 20,
      alignItems: "center",
      marginVertical: 10,
    },
    fetchButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    mealCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 10,
      marginVertical: 6,
      borderRadius: 12,
      elevation: 2,
    },
    mealImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 15,
    },
    mealName: {
      fontSize: 16,
      color: theme.text,
      flexShrink: 1,
    },
    errorText: {
      color: "#FF4D4D",
      textAlign: "center",
      marginTop: 10,
    },
  });

export default MealScreen;

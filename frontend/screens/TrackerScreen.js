import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import {useTheme} from '../utilities/ThemeContext';


export default function TrackerScreen() {
  const [food, setFood] = useState('');
  const [foodLog, setFoodLog] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const fetchNutrition = async (foodName) => {
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
          body: JSON.stringify({ query: foodName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch nutrition data");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.foods && data.foods.length > 0) {
        const newEntry = {
          name: foodName,
          calories: Math.round(data.foods[0].nf_calories) || 0,
          protein: Math.round(data.foods[0].nf_protein) || 0,
          carbs: Math.round(data.foods[0].nf_total_carbohydrate) || 0,
          fats: Math.round(data.foods[0].nf_total_fat) || 0,
        };

        setFoodLog([...foodLog, newEntry]);
        setTotals({
          calories: totals.calories + newEntry.calories,
          protein: totals.protein + newEntry.protein,
          carbs: totals.carbs + newEntry.carbs,
          fats: totals.fats + newEntry.fats,
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleAddFood = () => {
    if (food.trim() !== '') {
      fetchNutrition(food);
      setFood('');
    }
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.title}>
        Food <Text style={styles.highlight}>Tracker</Text>
      </Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter food"
          value={food}
          onChangeText={setFood}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddFood}>
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>
        
        <FlatList
          style={styles.foodList}
          data={foodLog}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.foodItem}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodCalories}>{item.calories} kcal</Text>
            </View>
          )}
        />
        <Text style={styles.totals}>
          Total: {totals.calories} kcal | {totals.protein}g Protein | {totals.carbs}g Carbs | {totals.fats}g Fats
        </Text>
      </View>
    </View>
  );
}

const getStyles =(theme)=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: theme.text,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    color: '#48E0E4',
  },
  card: {
    width: '90%',
    backgroundColor: theme.background,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.text,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    width: '100%',
    backgroundColor: theme.inputText,
    color: theme.text,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#48E0E4',
    borderRadius: 25,
    paddingVertical: 15,
    width: '75%',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodList: {
    marginTop: 20,
    width: '100%',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.background,
  },
  foodName: {
    color: theme.text,
    fontSize: 16,
  },
  foodCalories: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '300',
  },
  totals: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#48E0E4',
    textAlign: 'center',
  },
});

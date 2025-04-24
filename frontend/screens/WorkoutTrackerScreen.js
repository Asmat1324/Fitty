import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../utilities/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WorkoutTrackerScreen() {
  const { theme } = useTheme();
  const [exercise, setExercise] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [open, setOpen] = useState(null);
  const [exerciseLog, setExerciseLog] = useState([]);
  const [openSets, setOpenSets] = useState(false);
  const [openBodyPart, setOpenBodyPart] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSets, setSelectedSets] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const generateItems = (count) => {
    let arr = [];
    for (let i = 0; i <= count; i++) {
      arr.push({ label: `${i}`, value: i });
    }
    return arr;
  }
  const [setsList, setSetsList] = useState(generateItems(50));
  const [bodyPartList, setBodyPartList] = useState([
    { label: 'Chest', value: 'Chest' },
    { label: 'Shoulder', value: 'Shoulder' },
    { label: 'Back', value: 'Back' },
    { label: 'Legs', value: 'Legs' },
    { label: 'Arms', value: 'Arms' },

  ]);
  const handleCloseModal = () => {
    setOpen(false);
    setExercise('');
    setBodyPart('');
    setSelectedSets('');
    setModalVisible(false);
  };
  const handleAddExercise = () => {
    if (!exercise || !selectedSets || !selectedBodyPart) return;

    const newEntry = {
      name: exercise,
      sets: Array.from({ length: selectedSets }, () => ({ reps: '', weight: '' })),
      bodyPart: selectedBodyPart,
      id: Date.now(),
    };
    setExerciseLog([...exerciseLog, newEntry]);
    handleCloseModal();
  }
  const styles = useMemo(() => getStyles(theme), [theme]);
  //Set workout modal to visible
  const handleOpenModal = () => setModalVisible(true);
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.title}>
        Workout <Text style={styles.highlight}>Tracker</Text>
      </Text>
      <View style={styles.card}>
        <TouchableOpacity onPress={handleOpenModal} style={styles.button} >
          <Text style={styles.buttonText} >Add Exercise</Text>
        </TouchableOpacity>
        <FlatList
          data={exerciseLog}
          keyExtractor={(item) => item.id.toString()}
          style={styles.exerciseList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setExpandedId(expandedId === item.id ? null : item.id)} >
              <View
                style={[
                  styles.exerciseItem,
                  expandedId === item.id && {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                ]}
              >
                <Icon name={expandedId === item.id ? 'chevron-down' : 'chevron-forward'} size={20} color={theme.text} />
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseInfo}>
                  {item.bodyPart.charAt(0).toUpperCase() + item.bodyPart.slice(1)} | {item.sets.length} Sets
                </Text>
              </View>
              {expandedId === item.id && Array.isArray(item.sets) && (
                <View style={styles.setDropdown}>
                  {item.sets.map((set, index) => (
                    <View key={index} style={styles.setRow}>
                      <Text style={styles.setItem}>Set {index + 1}</Text>
                      <TextInput
                        style={styles.repInput}
                        placeholder="Weight"
                        keyboardType="numeric"
                        value={set.weight}
                        onChangeText={(text) => {
                          const updatedLog = [...exerciseLog];
                          const logIndex = updatedLog.findIndex(e => e.id === item.id);
                          updatedLog[logIndex].sets[index].weight = text;
                          setExerciseLog(updatedLog);
                        }}
                      />
                      <TextInput
                        style={styles.repInput}
                        placeholder="Reps"
                        keyboardType="numeric"
                        value={set.reps}
                        onChangeText={(text) => {
                          const updatedLog = [...exerciseLog];
                          const logIndex = updatedLog.findIndex(e => e.id === item.id);
                          updatedLog[logIndex].sets[index].reps = text;
                          setExerciseLog(updatedLog);
                        }}
                      />
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Exercise</Text>


            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              placeholderTextColor="#888"
              value={exercise}
              onChangeText={setExercise}
            />
            <View style={{ zIndex: 2000, marginBottom: 15 }}>
              <DropDownPicker
                open={openSets}
                value={selectedSets}
                items={setsList}
                style={styles.dropDown}
                setOpen={setOpenSets}
                setValue={setSelectedSets}
                setItems={setSetsList}
                placeholder="Sets"
                searchPlaceholderTextColor={theme.text}

              />
            </View>
            <View style={{ zIndex: 1000, marginBottom: 15 }}>
              <DropDownPicker
                open={openBodyPart}
                value={selectedBodyPart}
                items={bodyPartList}
                style={styles.dropDown}
                setOpen={setOpenBodyPart}
                setValue={setSelectedBodyPart}
                setItems={setBodyPartList}
                placeholder="Body Part"

              />

            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleAddExercise}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Log Exercise</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCloseModal}
                style={[styles.modalButton, { backgroundColor: '#999' }]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    color: theme.primary,
  },
  dropDown: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    fontColor: theme.text,
    placeholderTextColor: theme.text,
  },
  card: {
    width: '90%',
    backgroundColor: theme.card,
    padding: 5,
    paddingBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'center',
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
    backgroundColor: theme.buttonColor,
    borderRadius: 25,
    paddingVertical: 15,
    width: '75%',
    marginTop: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.text,
    fontSize: 0.038 * width, // 4.5% of screen width
    fontWeight: 'bold',
  },
  exerciseList: {
    marginTop: 20,
    width: '100%',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  exerciseName: {
    color: theme.text,
    fontSize: 0.034 * width,
    fontWeight: '600',
  },
  exerciseInfo: {
    color: theme.text,
    fontSize:  0.032 * width,
    fontWeight: '800',
  },
  totals: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: theme.primary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 0.048 * width,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: theme.buttonColor,
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  setDropdown: {
    backgroundColor: theme.card,
    marginTop: -8, // overlap the card a bit
    paddingHorizontal: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderTopWidth: 0, // remove border between card and dropdown
    borderColor: theme.border,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  repInput: {
    width: 70,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 16,
    fontColor: theme.text,
    backgroundColor: theme.inputText,
    color: theme.text,
  },
  weightInput: {
    width: 70,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: theme.inputText,
    color: theme.text,
  },
  setItem: {
    fontSize: 18,
    color: theme.text,
    paddingVertical: 4,
  },
});


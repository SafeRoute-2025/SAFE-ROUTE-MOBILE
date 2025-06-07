import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SafePlaceService from '../services/safePlaceService';

export default function SafePlacesScreen() {
  const [places, setPlaces] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [form, setForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    capacity: ''
  });

  const loadPlaces = async () => {
    try {
      const data = await SafePlaceService.getSafePlaces();
      setPlaces(data.content || data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar locais seguros.');
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      capacity: ''
    });
    setEditId(null);
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const openModal = (place = null) => {
    if (place) {
      setEditId(place.id);
      setForm({
        name: place.name,
        address: place.address,
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        capacity: String(place.capacity)
      });
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      capacity: parseInt(form.capacity)
    };

    try {
      if (editId) {
        await SafePlaceService.updateSafePlace(editId, payload);
        Alert.alert('Sucesso', 'Local seguro atualizado!');
      } else {
        await SafePlaceService.createSafePlace(payload);
        Alert.alert('Sucesso', 'Local seguro criado!');
      }
      setModalVisible(false);
      resetForm();
      loadPlaces();
    } catch (err) {
      Alert.alert('Erro', 'Erro ao salvar local seguro.');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Excluir', 'Deseja realmente excluir este local seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await SafePlaceService.deleteSafePlace(id);
            Alert.alert('Sucesso', 'Local excluído');
            loadPlaces();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir local');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Nome:</Text>
          <Text>{item.name}</Text>
          <Text style={styles.label}>Endereço:</Text>
          <Text>{item.address}</Text>
          <Text style={styles.label}>Capacidade:</Text>
          <Text>{item.capacity}</Text>
          <Text style={styles.label}>Localização:</Text>
          <Text>{item.latitude}, {item.longitude}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => openModal(item)}>
            <Icon name="pencil" size={22} color="#0B1E51" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon name="delete" size={22} color="#e74c3c" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps?q=${item.latitude},${item.longitude}`)}>
            <Icon name="map-marker" size={22} color="#2ecc71" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar por nome"
          value={filterName}
          onChangeText={setFilterName}
        />

        <FlatList
          data={places.filter(place =>
            place.name.toLowerCase().includes(filterName.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => openModal()}>
          <Text style={styles.buttonText}>+ Novo Local Seguro</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {editId ? 'Editar Local Seguro' : 'Cadastrar Local Seguro'}
                  </Text>

                  {['name', 'address', 'latitude', 'longitude', 'capacity'].map(field => (
                    <React.Fragment key={field}>
                      <Text style={styles.inputLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                      <TextInput
                        style={styles.input}
                        value={form[field]}
                        onChangeText={value => handleInputChange(field, value)}
                        keyboardType={['latitude', 'longitude', 'capacity'].includes(field) ? 'numeric' : 'default'}
                      />
                    </React.Fragment>
                  ))}

                  <TouchableOpacity onPress={handleSubmit} style={styles.primaryButton}>
                    <Text style={styles.buttonText}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelButton}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#F0F4FA',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 5,
    color: '#0B1E51',
  },
  primaryButton: {
    backgroundColor: '#0B1E51',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1E51',
    marginBottom: 20,
  },
  cancelButton: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: 'bold',
    color: '#0B1E51',
    marginBottom: 4,
    marginTop: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert,
  SafeAreaView, TextInput, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SafePlaceService from '../services/safePlaceService';
import * as ResourceService from '../services/resourceService';
import * as ResourceTypeService from '../services/resourceTypeService';

export default function ResourcesScreen() {
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [resources, setResources] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [openPlaceDropdown, setOpenPlaceDropdown] = useState(false);
  const [openTypeDropdown, setOpenTypeDropdown] = useState(false);
  const [safePlaces, setSafePlaces] = useState([]);
  const [filteredSafePlaces, setFilteredSafePlaces] = useState([]);

  const [form, setForm] = useState({
    id: null,
    resourceTypeId: '',
    availableQuantity: '',
  });

  const loadSafePlaces = async () => {
    try {
      const data = await SafePlaceService.getSafePlaces();
      const safePlaceList = Array.isArray(data?.content) ? data.content : [];
      setSafePlaces(safePlaceList);
      setFilteredSafePlaces(safePlaceList);
    } catch {
      Alert.alert('Erro', 'Erro ao carregar locais seguros.');
    }
  };

  const loadResources = async (placeId) => {
    try {
      const data = await ResourceService.getResourcesBySafePlace(placeId);
      setResources(data);
    } catch {
      Alert.alert('Erro', 'Erro ao carregar recursos.');
    }
  };

  const loadResourceTypes = async () => {
    try {
      const data = await ResourceTypeService.getAll();
      setResourceTypes(data);
    } catch {
      Alert.alert('Erro', 'Erro ao carregar tipos de recurso.');
    }
  };

  useEffect(() => {
    loadSafePlaces();
    loadResourceTypes();
  }, []);

  useEffect(() => {
    if (selectedPlaceId) {
      loadResources(selectedPlaceId);
    }
  }, [selectedPlaceId]);

  const filterPlaces = (text) => {
    setSearchName(text);
    const filtered = safePlaces.filter(p =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSafePlaces(filtered);
  };

  const openModal = (resource = null) => {
    if (resource) {
      setForm({
        id: resource.id,
        resourceTypeId: resource.resourceTypeId || '',
        availableQuantity: String(resource.availableQuantity),
      });
    } else {
      setForm({ id: null, resourceTypeId: '', availableQuantity: '' });
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!form.resourceTypeId || !form.availableQuantity) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const payload = {
      resourceTypeId: parseInt(form.resourceTypeId),
      availableQuantity: parseInt(form.availableQuantity),
      safePlaceId: parseInt(selectedPlaceId),
    };

    try {
      if (form.id) {
        await ResourceService.updateResource(form.id, payload);
        Alert.alert('Sucesso', 'Recurso atualizado!');
      } else {
        await ResourceService.createResource(payload);
        Alert.alert('Sucesso', 'Recurso criado!');
      }
      setModalVisible(false);
      setForm({ id: null, resourceTypeId: '', availableQuantity: '' });
      loadResources(selectedPlaceId);
    } catch {
      Alert.alert('Erro', 'Erro ao salvar recurso.');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Excluir', 'Deseja excluir este recurso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await ResourceService.deleteResource(id);
            Alert.alert('Sucesso', 'Recurso excluído!');
            loadResources(selectedPlaceId);
          } catch {
            Alert.alert('Erro', 'Erro ao excluir recurso.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Tipo:</Text>
          <Text>{item.resourceType}</Text>
          <Text style={styles.label}>Quantidade:</Text>
          <Text>{item.availableQuantity}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => openModal(item)}>
            <Icon name="pencil" size={22} color="#0B1E51" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon name="delete" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Filtrar por Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do local"
          value={searchName}
          onChangeText={filterPlaces}
        />

        <Text style={styles.title}>Selecione o Local Seguro</Text>
        <DropDownPicker
          open={openPlaceDropdown}
          value={selectedPlaceId}
          items={(filteredSafePlaces || []).map(place => ({
            label: place.name,
            value: place.id.toString()
          }))}
          setOpen={setOpenPlaceDropdown}
          setValue={setSelectedPlaceId}
          setItems={() => { }}
          placeholder="Escolha um local"
          style={styles.dropdown}
          zIndex={3000}
          zIndexInverse={1000}
        />

        {selectedPlaceId !== '' && (
          <>
            <FlatList
              data={resources}
              keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={() => openModal()}>
              <Text style={styles.buttonText}>+ Novo Recurso</Text>
            </TouchableOpacity>
          </>
        )}

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{form.id ? 'Editar Recurso' : 'Novo Recurso'}</Text>

                  <Text style={styles.inputLabel}>Tipo de Recurso</Text>
                  <DropDownPicker
                    open={openTypeDropdown}
                    value={form.resourceTypeId}
                    items={resourceTypes.map(t => ({
                      label: t.name,
                      value: t.id,
                    }))}
                    setValue={(val) => setForm((prev) => ({ ...prev, resourceTypeId: val() }))}
                    setOpen={setOpenTypeDropdown}
                    setItems={() => { }}
                    placeholder="Selecione um tipo"
                    style={styles.dropdown}
                    zIndex={2000}
                    zIndexInverse={1000}
                  />

                  <Text style={styles.inputLabel}>Quantidade</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.availableQuantity}
                    onChangeText={(value) => setForm((prev) => ({ ...prev, availableQuantity: value }))}
                  />

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
  container: { flex: 1, padding: 16, backgroundColor: '#F0F4FA', paddingTop: 40 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#0B1E51', marginBottom: 10 },
  list: { paddingBottom: 80 },
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 12, borderRadius: 10, elevation: 2 },
  label: { fontWeight: 'bold', color: '#0B1E51', marginTop: 5 },
  primaryButton: { backgroundColor: '#0B1E51', padding: 12, borderRadius: 30, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { color: '#e74c3c', fontWeight: 'bold', marginTop: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  inputLabel: { fontWeight: 'bold', color: '#0B1E51', marginBottom: 4, marginTop: 10 },
  dropdown: { marginBottom: 10 },
  modalContent: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0B1E51', marginBottom: 20 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButtons: { justifyContent: 'space-between', alignItems: 'center', gap: 12 },
});

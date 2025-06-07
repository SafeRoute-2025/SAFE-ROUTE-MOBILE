import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as EventService from '../services/eventService.js';

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventTypeOptions, setEventTypeOptions] = useState([]);
  const [eventTypeValue, setEventTypeValue] = useState(null);
  const [editEventId, setEditEventId] = useState(null);

  const [form, setForm] = useState({
    eventType: '',
    description: '',
    eventDate: '',
    riskLevel: '',
    latitude: '0',
    longitude: '0',
  });

  const [riskOpen, setRiskOpen] = useState(false);
  const [riskOptions, setRiskOptions] = useState([
    { label: 'Alto', value: 'High' },
    { label: 'Médio', value: 'Medium' },
    { label: 'Baixo', value: 'Low' },
  ]);
  const [riskValue, setRiskValue] = useState(null);

  const loadEvents = async () => {
    try {
      const data = await EventService.getEvents();
      setEvents(data?.content || data || []);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      Alert.alert('Erro', 'Erro ao carregar eventos');
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetForm = () => {
    setForm({
      eventType: '',
      description: '',
      eventDate: '',
      riskLevel: 'LOW',
      latitude: '0',
      longitude: '0',
    });
    setEventTypeValue(null);
    setRiskValue(null);
    setEditEventId(null);
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const openModal = async (event = null) => {
    try {
      const types = await EventService.getEventTypes();
      const options = types.map(type => ({ label: type.name, value: type.name }));
      setEventTypeOptions(options);

      if (event) {
        setEditEventId(event.id);
        setForm({
          eventType: event.eventType,
          description: event.description,
          eventDate: event.eventDate,
          riskLevel: event.riskLevel,
          latitude: String(event.latitude),
          longitude: String(event.longitude),
        });
        setEventTypeValue(event.eventType);
        setRiskValue(event.riskLevel);
      } else {
        resetForm();
      }

      setModalVisible(true);
    } catch (err) {
      console.error('Erro ao preparar modal:', err);
      Alert.alert('Erro', 'Erro ao carregar dados do evento');
    }
  };

  const handleSubmit = async () => {
    try {
      const formatLocalDateTime = (date) => {
        const pad = n => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      };

      const payload = {
        ...form,
        eventType: eventTypeValue,
        riskLevel: riskValue,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        eventDate: form.eventDate ? formatLocalDateTime(new Date(form.eventDate)) : formatLocalDateTime(new Date()),
        description: form.description || 'Sem descrição'
      };

      if (editEventId) {
        await EventService.updateEvent(editEventId, payload);
        Alert.alert('Sucesso', 'Evento atualizado com sucesso!');
      } else {
        await EventService.createEvent(payload);
        Alert.alert('Sucesso', 'Evento criado com sucesso!');
      }

      setModalVisible(false);
      resetForm();
      loadEvents();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
      console.error(err);
    }
  };

  const renderItem = ({ item }) => {
    if (!item) return null;
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Tipo:</Text>
            <Text>{item.eventType}</Text>
            <Text style={styles.label}>Descrição:</Text>
            <Text>{item.description}</Text>
            <Text style={styles.label}>Data:</Text>
            <Text>{new Date(item.eventDate).toLocaleString('pt-BR')}</Text>
            <Text style={styles.label}>Risco:</Text>
            <Text>{item.riskLevel}</Text>
            <Text style={styles.label}>Localização:</Text>
            <Text>{item.latitude}, {item.longitude}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => openModal(item)}>
              <Icon name="pencil" size={22} color="#0B1E51" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              Alert.alert('Excluir', 'Deseja excluir este evento?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir',
                  onPress: async () => {
                    try {
                      await EventService.deleteEvent(item.id);
                      Alert.alert('Sucesso', 'Evento excluído');
                      loadEvents();
                    } catch (err) {
                      Alert.alert('Erro', 'Erro ao excluir evento');
                      console.error(err);
                    }
                  }
                }
              ]);
            }}>
              <Icon name="delete" size={22} color="#e74c3c" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps?q=${item.latitude},${item.longitude}`)}>
              <Icon name="map-marker" size={22} color="#2ecc71" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={events}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity style={styles.newButton} onPress={() => openModal()}>
          <Text style={styles.buttonText}>+ Novo Evento</Text>
        </TouchableOpacity>
        <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{editEventId ? 'Editar Evento' : 'Criar Evento'}</Text>

                  <Text style={styles.inputLabel}>Tipo de Evento</Text>
                  <DropDownPicker
                    open={eventTypeOpen}
                    value={eventTypeValue}
                    items={eventTypeOptions}
                    setOpen={setEventTypeOpen}
                    setValue={setEventTypeValue}
                    setItems={setEventTypeOptions}
                    onChangeValue={(value) => handleInputChange('eventType', value)}
                    placeholder="Selecione um tipo"
                    style={{ marginBottom: 20 }}
                    zIndex={6000}
                    zIndexInverse={1000}
                  />

                  <Text style={styles.inputLabel}>Descrição</Text>
                  <TextInput
                    style={styles.input}
                    value={form.description}
                    onChangeText={value => handleInputChange('description', value)}
                  />

                  <Text style={styles.inputLabel}>Data do Evento</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
                    <Text>{form.eventDate ? new Date(form.eventDate).toLocaleString('pt-BR') : 'Selecionar data e hora'}</Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={form.eventDate ? new Date(form.eventDate) : new Date()}
                      mode="datetime"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setForm(prev => ({
                            ...prev,
                            eventDate: selectedDate.toISOString().slice(0, 16),
                          }));
                        }
                      }}
                    />
                  )}

                  <Text style={styles.inputLabel}>Nível de Risco</Text>
                  <DropDownPicker
                    open={riskOpen}
                    value={riskValue}
                    items={riskOptions}
                    setOpen={setRiskOpen}
                    setValue={setRiskValue}
                    setItems={setRiskOptions}
                    onChangeValue={(value) => handleInputChange('riskLevel', value)}
                    placeholder="Selecione um nível"
                    style={{ marginBottom: 20 }}
                    zIndex={5000}
                    zIndexInverse={1000}
                  />

                  <Text style={styles.inputLabel}>Latitude</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.latitude}
                    onChangeText={value => handleInputChange('latitude', value)}
                  />

                  <Text style={styles.inputLabel}>Longitude</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.longitude}
                    onChangeText={value => handleInputChange('longitude', value)}
                  />

                  <TouchableOpacity onPress={handleSubmit} style={styles.newButton}>
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
  container: { flex: 1, padding: 16, backgroundColor: '#F0F4FA' },
  list: { paddingBottom: 80 },
  label: { fontWeight: 'bold', color: '#0B1E51', marginTop: 5 },
  newButton: { backgroundColor: '#0B1E51', padding: 12, borderRadius: 30, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0B1E51', marginBottom: 20 },
  cancelButton: { color: '#e74c3c', fontWeight: 'bold', marginTop: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  inputLabel: { fontWeight: 'bold', color: '#0B1E51', marginBottom: 4, marginTop: 10 },
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 3 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButtons: { justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  modalContent: { flex: 1, justifyContent: 'center', backgroundColor: '#fff', padding: 20 },
});

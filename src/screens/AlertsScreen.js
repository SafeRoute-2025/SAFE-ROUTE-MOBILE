import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as AlertService from '../services/alertService';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [sentAt, setSentAt] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDeletingOld, setIsDeletingOld] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);


  const loadAlerts = async () => {
    try {
      const data = await AlertService.getAlerts();
      setAlerts(data.content || data || []);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao carregar alertas.');
    }
  };

  const loadEvents = async () => {
    try {
      const data = await AlertService.getEventList();
      const options = data.map(event => {
        const date = new Date(event.eventDate);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return {
          label: `${event.eventType} - ${event.description || "Sem descrição"} (${formattedDate})`,
          value: event.id,
        };
      });
      setEventOptions(options);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao carregar eventos.');
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleCreateAlert = async () => {
    if (!selectedEventId || !message) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      eventId: selectedEventId,
      message,
      sentAt: sentAt ? new Date(sentAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    };

    try {
      await AlertService.createAlert(payload);
      Alert.alert('Sucesso', 'Alerta criado com sucesso!');
      setModalVisible(false);
      setMessage('');
      setSentAt('');
      setSelectedEventId(null);
      loadAlerts();
    } catch (err) {
      Alert.alert('Erro', 'Erro ao criar alerta.');
    }
  };

  const handleDeleteOldAlerts = async () => {
    Alert.alert('Excluir', 'Deseja excluir TODOS os alertas com mais de 7 dias?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeletingOld(true);
            await AlertService.deleteOldAlerts();
            Alert.alert('Sucesso', 'Alertas antigos excluídos!');
            await loadAlerts();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir alertas antigos.');
          } finally {
            setIsDeletingOld(false);
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Data e Hora:</Text>
          <Text>{new Date(item.sentAt).toLocaleString('pt-BR')}</Text>

          <Text style={styles.label}>Evento:</Text>
          <Text>{item.event}</Text>

          <Text style={styles.label}>Mensagem:</Text>
          <Text>{item.message}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Excluir', 'Deseja excluir este alerta?', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Excluir',
                onPress: async () => {
                  try {
                    await AlertService.deleteAlert(item.id);
                    Alert.alert('Sucesso', 'Alerta excluído!');
                    loadAlerts();
                  } catch (err) {
                    Alert.alert('Erro', 'Erro ao excluir alerta.');
                    console.error(err);
                  }
                }
              }
            ]);
          }}
        >
          <Icon name="delete" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <TouchableOpacity
          onPress={() => setShowFilterDatePicker(true)}
          style={[styles.input, { justifyContent: 'center', marginBottom: 10 , alignContent: 'center', alignItems: 'center'}]}
        >
          <Text>
            {filterDate
              ? new Date(filterDate).toLocaleDateString('pt-BR')
              : 'Filtrar por data'}
          </Text>
        </TouchableOpacity>
        <View style={styles.filterRow}>
            <DateTimePicker
              value={filterDate ? new Date(filterDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowFilterDatePicker(false);
                if (selectedDate) {
                  setFilterDate(selectedDate.toISOString().split('T')[0]);
                }
              }}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            />
          <TouchableOpacity onPress={() => setFilterDate(null)}>
            <Text style={{ color: '#0B1E51', textAlign: 'center', alignSelf: 'center', justifyContent: 'center' , fontWeight: 'bold' }}>
              Limpar filtro
            </Text>
          </TouchableOpacity>


        </View>

        <FlatList
          data={alerts.filter(alert => {
            if (!filterDate) return true;
            const alertDate = new Date(alert.sentAt).toISOString().split('T')[0];
            return alertDate === filterDate;
          })}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />


        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteOldAlerts} disabled={isDeletingOld}>
            {isDeletingOld ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Excluir +7 dias</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={async () => {
              await loadEvents();
              if (!sentAt) setSentAt(new Date());
              setModalVisible(true);
            }}
          >

            <Text style={styles.buttonText}>+ Novo Alerta</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Criar Alerta</Text>

                <Text style={styles.inputLabel}>Evento</Text>
                <DropDownPicker
                  open={eventOpen}
                  value={selectedEventId}
                  items={eventOptions}
                  setOpen={setEventOpen}
                  setValue={setSelectedEventId}
                  setItems={setEventOptions}
                  placeholder="Selecione um evento"
                  zIndex={2000}
                  zIndexInverse={1000}
                  style={{ marginBottom: 20 }}
                />

                <Text style={styles.inputLabel}>Mensagem</Text>
                <TextInput
                  style={styles.input}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Digite a mensagem"
                />

                <Text style={styles.inputLabel}>Data e Hora</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.input, { justifyContent: 'center' }]}
                >
                  <Text>
                    {sentAt ? new Date(sentAt).toLocaleString('pt-BR') : 'Selecionar data e hora'}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={sentAt ? new Date(sentAt) : new Date()}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setSentAt(selectedDate);
                      }
                    }}
                  />
                )}

                <TouchableOpacity onPress={handleCreateAlert} style={styles.modalButton}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButton}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F4FA',
  },
  list: {
    paddingBottom: 100,
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#0B1E51',
    flex: 1,
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
    flex: 1,
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalButton: {
    backgroundColor: '#0B1E51',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 30, // largura mínima
    marginTop: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

});

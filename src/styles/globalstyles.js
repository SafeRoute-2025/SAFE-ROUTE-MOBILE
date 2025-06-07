import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F4FA',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#0B1E51',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4FA',
  },

  // Texts
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B1E51',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#0B1E51',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 30,
  },

  // Buttons
  primaryButton: {
    backgroundColor: '#0B1E51',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  mainButton: {
    backgroundColor: '#0B1E51',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 30,
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
  },

  // Inputs
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#0B1E51',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14,
    color: '#000',
  },

  // Cards e listas
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
  cardText: {
    color: '#333',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },

  // Modal
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1E51',
    marginBottom: 20,
  },

  // Outros
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  tip: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
  },
  tipTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#856404',
  },
  tipText: {
    color: '#856404',
    fontStyle: 'italic',
  },
});

export default styles;

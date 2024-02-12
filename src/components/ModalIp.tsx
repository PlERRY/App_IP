// ModalIP.tsx
import React from 'react';
import { Modal, View, TouchableWithoutFeedback, Button, Text, TextInput } from 'react-native';
import styles from '../../Styles';

interface ModalIPProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  handleSaveIp: () => void;
  newIp: string;
  setNewIp: (text: string) => void;
  newSec: string;
  setNewSec: (text: string) => void;
  newUser: string;
  setNewUser: (text: string) => void;
}

const ModalIP: React.FC<ModalIPProps> = ({
  modalVisible,
  setModalVisible,
  handleSaveIp,
  newIp,
  setNewIp,
  newSec,
  setNewSec,
  newUser,
  setNewUser,
}) => {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Editar IP</Text>
          <View style={styles.modalInput}>
            <Text style={styles.modalInputLabel}>IP:</Text>
            <TextInput
              style={styles.modalTextInput}
              value={newIp}
              onChangeText={setNewIp}
              placeholder='Digite o IP'
              placeholderTextColor='#696969'
            />
          </View>
          <View style={styles.modalInput}>
            <Text style={styles.modalInputLabel}>Secretaria:</Text>
            <TextInput
              style={styles.modalTextInput}
              value={newSec}
              onChangeText={setNewSec}
              placeholder='Digite a Secretaria'
              placeholderTextColor='#696969'
            />
          </View>
          <View style={styles.modalInput}>
            <Text style={styles.modalInputLabel}>Usuário:</Text>
            <TextInput
              style={styles.modalTextInput}
              value={newUser}
              onChangeText={setNewUser}
              placeholder='Digite o Usuário'
              placeholderTextColor='#696969'
            />
          </View>
          <View style={styles.modalButtons}>
            <Button title='Fechar' onPress={() => setModalVisible(false)} color='#4B0082' />
            <Button title='Salvar' onPress={handleSaveIp} color='#4B0082' />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalIP;

import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableWithoutFeedback, Button, Text, TextInput, Alert } from 'react-native';
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
  handleDeleteIp: () => void;
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
  handleDeleteIp
}) => {
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);

  const handleSaveAndCheckIp = () => {
    const ipParts = newIp.split('.').map(part => parseInt(part));

    if (ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
      Alert.alert('Solicitação', 'Por favor, insira um IP válido.');
      return;
    }

    if (ipParts[3] === 0 || ipParts[3] === 255) {
      Alert.alert('Solicitação', 'Os IPs com o último octeto 0 ou 255 são reservados para a rede e não podem ser atribuídos a um host.');
      return;
    }

    handleSaveIp();
  };

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
              placeholder='192.168.14.XXX'
              placeholderTextColor='#696969'
              keyboardType='numeric'
              maxLength={15}
              onSubmitEditing={handleSaveAndCheckIp}
             
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
            <Button title='Deletar' onPress={handleDeleteIp} color="#4B0082"/>
            <Button title='Salvar' onPress={handleSaveAndCheckIp} color='#4B0082' />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalIP;

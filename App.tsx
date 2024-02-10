import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';

const App = () => {
  const [ip, setIp] = useState('');
  const [data, setData] = useState([
    { ip: `192.168.140.${Math.floor(Math.random() * 256)}`, sec: 'Secretaria 140', user: 'Usuário 140' },
    { ip: `192.168.140.${Math.floor(Math.random() * 256)}`, sec: 'Secretaria 140', user: 'Usuário 140' },
    { ip: `192.168.145.${Math.floor(Math.random() * 256)}`, sec: 'Secretaria 145', user: 'Usuário 145' },
    { ip: `192.168.145.${Math.floor(Math.random() * 256)}`, sec: 'Secretaria 145', user: 'Usuário 145' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newSec, setNewSec] = useState('');
  const [newUser, setNewUser] = useState('');
  const [filter140, setFilter140] = useState(false);
  const [filter145, setFilter145] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredData, setFilteredData] = useState([...data]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    filterData();
  }, [filter140, filter145, data, sortOrder]);

  useEffect(() => {
    handleSearch(ip);
  }, [ip]);

  const filterData = () => {
    let filteredData = [...data];
    if (filter140 && filter145) {
      filteredData = data.filter(item => item.ip.startsWith("192.168.140.") || item.ip.startsWith("192.168.145."));
    } else if (filter140) {
      filteredData = data.filter(item => item.ip.startsWith("192.168.140."));
    } else if (filter145) {
      filteredData = data.filter(item => item.ip.startsWith("192.168.145."));
    }

    // Ordenar os IPs do maior para o menor dentro de cada faixa
    filteredData = sortIPs(filteredData);

    setFilteredData(filteredData);
  };

  const sortIPs = (ips) => {
    return ips.sort((a, b) => {
      const lastOctetA = parseInt(a.ip.split('.')[3]);
      const lastOctetB = parseInt(b.ip.split('.')[3]);

      if (sortOrder === 'asc') {
        return lastOctetB - lastOctetA;
      } else {
        return lastOctetA - lastOctetB;
      }
    });
  };

  const groupByFaixa = (ips) => {
    const groupedData = {};
    ips.forEach(item => {
      const faixa = item.ip.split('.')[2];
      if (!groupedData[faixa]) {
        groupedData[faixa] = [];
      }
      groupedData[faixa].push(item);
    });
    return groupedData;
  };

  const handleSearch = (searchText) => {
    let filteredData = [...data];
    if (searchText) {
      filteredData = data.filter(item => {
        const lastOctet = parseInt(item.ip.split('.')[3]);
        return lastOctet.toString().startsWith(searchText);
      });
    } else {
      if (filter140 && !filter145) {
        filteredData = data.filter(item => item.ip.startsWith("192.168.140."));
      } else if (!filter140 && filter145) {
        filteredData = data.filter(item => item.ip.startsWith("192.168.145."));
      } else if (filter140 && filter145) {
        filteredData = data.filter(item => item.ip.startsWith("192.168.140.") || item.ip.startsWith("192.168.145."));
      }
    }
    setFilteredData(filteredData);
  };

  const handleAddIp = () => {
    setModalVisible(true);
    setSelectedItem(null);
  };

  const handleSaveIp = () => {
    if (selectedItem) {
      const newData = data.map(item => {
        if (item === selectedItem) {
          return { ip: newIp, sec: newSec, user: newUser };
        }
        return item;
      });
      setData(newData);
    } else {
      const newData = [...data, { ip: newIp, sec: newSec, user: newUser }];
      setData(newData);
    }
    setModalVisible(false);
    setNewIp('');
    setNewSec('');
    setNewUser('');
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleItemPress = (item) => {
    setModalVisible(true);
    setSelectedItem(item);
    setNewIp(item.ip);
    setNewSec(item.sec);
    setNewUser(item.user);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de IPs</Text>
      </View>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          value={ip}
          onChangeText={setIp}
          placeholder='Buscar por último octeto do IP...'
          placeholderTextColor='#696969'
          keyboardType='numeric'
          maxLength={6}
        />
        <Icon name='add-circle' type='ionicon' color='#4B0082' size={45} onPress={handleAddIp} />
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            title='140'
            checked={filter140}
            onPress={() => setFilter140(!filter140)}
            containerStyle={styles.checkbox}
            textStyle={styles.checkboxText}
          />
          <CheckBox
            title='145'
            checked={filter145}
            onPress={() => setFilter145(!filter145)}
            containerStyle={styles.checkbox}
            textStyle={styles.checkboxText}
          />
        </View>
        <TouchableWithoutFeedback onPress={toggleSortOrder}>
          <Icon name={sortOrder === 'asc' ? 'caret-up-outline' : 'caret-down-outline'} type='ionicon' color='#4B0082' size={24} />
        </TouchableWithoutFeedback>
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.ip}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)} onLongPress={() => handleItemLongPress(item)}>
            <View style={styles.itemContainer}>
              <Text style={styles.ipText}>{item.ip}</Text>
              <Text style={styles.secUserText}>{item.sec}</Text>
              <Text style={styles.secUserText}>{item.user}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
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
            <Text style={styles.modalTitle}>{selectedItem ? 'Editar IP' : 'Adicionar Novo IP'}</Text>
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
              <Button title={selectedItem ? 'Salvar Alterações' : 'Salvar'} onPress={handleSaveIp} color='#4B0082' />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginRight: 10,
  },
  checkboxText: {
    color: '#4B0082',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#4B0082',
    borderWidth: 1,
    borderRadius: 5,
    color: '#4B0082',
    paddingLeft: 10,
    marginRight: 10,
    fontSize: 16,
    height: 40,
  },
  itemContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  ipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  secUserText: {
    fontSize: 14,
    color: '#4B0082',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 15,
  },
  modalInput: {
    marginBottom: 15,
  },
  modalInputLabel: {
    color: '#4B0082',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTextInput: {
    borderColor: '#4B0082',
    borderWidth: 1,
    borderRadius: 5,
    color: '#4B0082',
    paddingLeft: 10,
    fontSize: 14,
    height: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

export default App;

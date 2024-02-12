import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';
import bd from '../BD/fireBD';
import { getFirestore, collection, query, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import ModalIP from '../components/ModalIp';
import styles from '../../Styles';

type dataProps = {
  id?: string;
  ip: string;
  sec: string;
  user: string;
}

const Home = () => {
  const [ip, setIp] = useState('');
  const [data, setData] = useState<dataProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newSec, setNewSec] = useState('');
  const [newUser, setNewUser] = useState('');
  const [filter140, setFilter140] = useState(false);
  const [filter145, setFilter145] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredData, setFilteredData] = useState([...data]);
  const [selectedItem, setSelectedItem] = useState(null);
  const BD = getFirestore(bd);

  const buscaDados = async () => {
    const q = query(collection(BD, 'banco'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ips: dataProps[] = [];

      querySnapshot.forEach((doc) => {
        const { ip, sec, user } = doc.data();
        ips.push({
          id: doc.id,
          ip,
          sec,
          user
        });
      });

      setData(ips);
      filterData();
    });

    return unsubscribe;
  }

  useEffect(() => {
    buscaDados();
  }, [])

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

  const sortIPs = (ips: any) => {
    return ips.sort((a: dataProps, b: dataProps) => {
      const lastOctetA = parseInt(a.ip.split('.')[3]);
      const lastOctetB = parseInt(b.ip.split('.')[3]);

      if (sortOrder === 'asc') {
        return lastOctetB - lastOctetA;
      } else {
        return lastOctetA - lastOctetB;
      }
    });
  };

  const handleSearch = (searchText: any) => {
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
    setNewIp('')
    setNewSec('')
    setNewUser('')
    setModalVisible(true);
    setSelectedItem(null);
  };

  async function handleRegisterIP(ip: string, sec: string, user: string) {
    await addDoc(collection(BD, "banco"), {
      ip,
      sec,
      user
    })
      .then(() => {
        buscaDados();
        return Alert.alert("Solicitação", "IP registrado com sucesso!")
      }).catch(error => {
        console.log(error);
        return Alert.alert('Solicitação', 'Não foi possivel registrar o ip.');
      })
  }

  async function handleUpdadeIp(ip: any, sec: any, user: any, ipOlder: any) {
    await updateDoc(doc(BD, "banco", ipOlder), {
      ip,
      sec,
      user
    })
      .then(() => {
        buscaDados();
        return Alert.alert("Solicitação", "IP atualizado com sucesso!")
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", 'Não foi possível atualizar IP.')
      })

  }

  const handleSaveIp = () => {
    if (selectedItem) {
      const newData = data.map(item => {
        if (item === selectedItem) {
          return handleUpdadeIp(newIp, newSec, newUser, item.id)
        }
        return item;
      });

    } else {

      handleRegisterIP(newIp, newSec, newUser);

    }
    setModalVisible(false);
    setNewIp('');
    setNewSec('');
    setNewUser('');
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleItemPress = (item: any) => {
    setModalVisible(true);
    setSelectedItem(item);
    setNewIp(item.ip);
    setNewSec(item.sec);
    setNewUser(item.user);
  };
  console.log("HOME Selected item:", selectedItem);
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

      <ModalIP
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleSaveIp={handleSaveIp}
        newIp={newIp}
        setNewIp={setNewIp}
        newSec={newSec}
        setNewSec={setNewSec}
        newUser={newUser}
        setNewUser={setNewUser}
        isUpdate={!!selectedItem} // Sinalize que é uma atualização
        existingIp={selectedItem ? selectedItem.ip : ''} // Passe o IP existente para o ModalIP
      />

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
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.itemContainer}>
              <Text style={styles.ipText}>{item.ip}</Text>
              <Text style={styles.secUserText}>{item.sec}</Text>
              <Text style={styles.secUserText}>{item.user}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
};

export default Home;

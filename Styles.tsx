// Styles.tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:5,
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

export default styles;

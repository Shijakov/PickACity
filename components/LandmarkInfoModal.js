import { View, Text, Modal, StyleSheet, ScrollView } from "react-native";

const LandmarkInfoModal = ({modal: {name, description, isVisible}, closeModal}) => {

    return <View>
    <Modal 
    animationType='slide'
    visible={isVisible}
    transparent >
        <View style={styles.contentContainer}>
            <View style={styles.closeIcon} onTouchEnd={closeModal}>
                <Text style={{fontSize: 30, color: 'grey'}}>x</Text>
            </View>
            <View style={styles.title}>
                <Text style={{fontSize: 25}}>{name}</Text>
            </View>
            <ScrollView>
                {description !== '' ? <Text>{description}</Text> : <Text>Loading...</Text>}
            </ScrollView>
        </View>
    </Modal>
  </View>
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20,
      backgroundColor: 'white',
      height: '40%', 
      width: '100%',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      position: 'absolute', 
      bottom: 0,
    },
    title: {
        marginBottom: 15,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        paddingHorizontal: 10
    }
  });

export default LandmarkInfoModal;
import { View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import FloatingButton from "./FloatingButton";
import { useEffect } from "react";
import { FAB } from "react-native-elements";
import { StatusBar } from "expo-status-bar";

const FiltersModal = ({isVisible, closeModal, selectedContinent, setSelectedContinent}) => {

    const data = [
        {label: 'Select continent', value: null},
        {label: 'Africa', value: 'AF'},
        {label: 'Asia', value: 'AS'},
        {label: 'Europe', value: 'EU'},
        {label: 'North America', value: 'NA'},
        {label: 'South America', value: 'SA'},
        {label: 'Oceania', value: 'OC'},
        {label: 'Antarctica', value: 'AN'},
    ]

    return <View >
    <Modal 
    animationIn="slideInDown"
    animationOut="slideOutUp"
    isVisible={isVisible}
    hasBackdrop={false}
    style={{margin: 0}}
     >
        <View style={styles.contentContainer}>
            <View>
                <Dropdown 
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={data} 
                    labelField="label"
                    valueField="value"
                    value={selectedContinent}
                    onChange={item => setSelectedContinent(item.value)}
                    placeholder="Select continent" />
            </View>
            <View onTouchEnd={closeModal}>
                <FAB title="Ok" />
            </View>
        </View>
    </Modal>
  </View>
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20,
      backgroundColor: 'white',
      width: '100%',
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      position: 'absolute', 
      top: 0,
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5, 
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
  });

export default FiltersModal;
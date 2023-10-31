import { View, StyleSheet } from "react-native"

const RedCircle = () => {
    return <View style={styles.circle}>

    </View>
}

const styles = StyleSheet.create({
    circle: {
        backgroundColor: 'red',
        height: 15,
        width: 15,
        borderRadius: 50
    }
})

export default RedCircle;
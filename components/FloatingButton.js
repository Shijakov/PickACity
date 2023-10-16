import { FAB } from "react-native-elements";
import { StyleSheet, View } from "react-native";

export default function FloatingButton({onButonClicked, disabled, title, position}) {

    return <View onTouchEnd={onButonClicked} style={{...styles.fab, ...position}}>
        <FAB disabled={disabled} title={title} />
    </View>
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 'auto',
        zIndex: 100    
    }
})
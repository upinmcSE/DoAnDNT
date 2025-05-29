import {View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {TextGlobal} from "./TextGlobal";

export default function NotifyEmail({success}) {
    return (
        <View style={success ? styles.success : styles.error}>
            <Ionicons name={success ? 'checkmark-circle-outline' : 'close-circle-outline'} size={140} color='white'></Ionicons>
            <TextGlobal color='white' content={success ? 'Chúng tôi đã gửi mail xác nhận về email của bạn' : 'Thất bại'}/>
        </View>
    )
}

const styles = StyleSheet.create({
    success: {
        backgroundColor: "#009efd",
        opacity: 0.9,
        alignItems: "center",
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap:10
    },
    error: {
        backgroundColor: "#FF6060",
        opacity: 0.9,
        alignItems: "center",
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap:10
    }
})
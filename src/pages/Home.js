import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { React, useContext, useState } from "react";
import AuthContext from "../context/firebaseContext/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import theme from "../theme";
import StyledTouchableHighlight from "../components/StyledTouchableHighlight";
import Chat from "../components/componentesEspecificos/Chat";
import StyledText from "../components/StyledText";
const Stack = createNativeStackNavigator();
export default function Home({ navigation }) {
  const { logOut } = useContext(AuthContext);
  const [salaUno, setSalaUno] = useState(false);
  const [salaDos, setSalaDos] = useState(false);
  const [salas, setShowSalas] = useState(true);
  const logout = () => {
    logOut().then(() => navigation.navigate("Login"));
  };
  const handleChatUno = () => {
    setSalaUno(true);
    setSalaDos(false);
    setShowSalas(false);
  };
  const handleChatDos = () => {
    setSalaUno(false);
    setSalaDos(true);
    setShowSalas(false);
  };
  const onVolverSalas = () => {
    setSalaUno(false);
    setSalaDos(false);
    setShowSalas(true);
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      {salaUno && <Chat nombreSala="uno" onVolver={onVolverSalas}></Chat>}
      {salaDos && <Chat nombreSala="dos" onVolver={onVolverSalas}></Chat>}
      {salas && (
        <View style={styles.container}>
          <StyledTouchableHighlight
            style={styles.btnScreen1}
            btnScreen
            onPress={handleChatUno}
          >
            <StyledText fontSize={"heading"}>Sala 4°A</StyledText>
          </StyledTouchableHighlight>
          <StyledTouchableHighlight
            style={styles.btnScreen2}
            btnScreen
            onPress={handleChatDos}
          >
            <StyledText fontSize={"heading"} style={{ color: "white" }}>
              Sala 4°B
            </StyledText>
          </StyledTouchableHighlight>
          <View style={styles.btnLogout}>
            <StyledTouchableHighlight
              style={styles.btnLogout}
              btnLogout
              onPress={logout}
            >
              <StyledText fontSize={"subHeading"} style={{ color: "white" }}>
                Cerrar Sesión
              </StyledText>
            </StyledTouchableHighlight>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    justifyContent: "flex-end",
    alignItems: "center",
    // backgroundColor: theme.colores.primary,
    backgroundColor: "red",
  },
  btnScreen1: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.5,
    backgroundColor: theme.colores.secondary,
  },
  btnScreen2: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.42,
    backgroundColor: theme.colores.detaile2,
  },
  btnLogout: {
    position: "relative",
    bottom: 0,
    left: 0,
  },
});

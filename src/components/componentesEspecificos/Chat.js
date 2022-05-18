import React, {
  useState,
  useContext,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  Send,
  Time,
  InputToolbar,
  Composer,
} from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";
import {
  agregarMensaje,
  getAllMensajes,
} from "../../services/FirestoreServices";
import { auth } from "../../../firebase";
import StyledTouchableHighlight from "../StyledTouchableHighlight";
import StyledText from "../StyledText";
import theme from "../../theme";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

export const windowHeight = Dimensions.get("window").height;
export const windowWidth = Dimensions.get("window").width;

export default function Chat(props) {
  const { nombreSala } = props;
  const [messages, setMessages] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const AR = require("dayjs/locale/es-mx");
  useLayoutEffect(() => {
    getAllMensajes(
      "chats",
      (data) => {
        const respuesta = data.docs.map((doc) => doc.data());
        setMessages(
          respuesta
            .filter((m) => m.sala == nombreSala)
            .map((M) => ({
              _id: M._id,
              createdAt: M.createdAt.toDate(),
              text: M.text,
              user: { _id: M.user._id, name: M.user._id },
            }))
        );
      },
      (error) => console.log(error)
    ).then(() => {
      setTimeout(() => {
        setSpinner(false);
      }, 3000);
    });
  }, []);

  const onSend = useCallback((messages = []) => {
    if (messages[0].text.length < 22) {
      Keyboard.dismiss();
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      // setMessages([...messages, ...messages]);
      const { _id, createdAt, text, user } = messages[0];
      //aca servicio para guardar el menasje
      agregarMensaje("chats", {
        _id,
        createdAt,
        text,
        user,
        sala: nombreSala,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "El mensaje debe ser menor de 21 caracteres",
        position: "bottom",
      });
    }
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          //#c7c5c6
          right: [
            nombreSala == "uno" && styles.burbujaRightUno,
            nombreSala == "dos" && styles.burbujaRightDos,
          ],
          left: [
            nombreSala == "uno" && styles.burbujaLeftUno,
            nombreSala == "dos" && styles.burbujaLeftDos,
          ],
        }}
        textStyle={{
          right: {
            color: "black",
          },
          left: {
            color: "black",
          },
        }}
        usernameStyle={{ color: "#5e5c5d" }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        textStyle={{
          color: "white",
        }}
        label={"Enviar"}
      ></Send>
    );
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        placeholder={"Escriba un mensaje"}
        placeholderTextColor={"black"}
        composerHeight={60}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        //Add the extra styles via containerStyle here
        //Add any other option you want to pass like placeholder
        primaryStyle={[
          nombreSala == "uno" && styles.inputToolBarUno,
          nombreSala == "dos" && styles.inputToolBarDos,
          {
            color: "white",
          },
        ]}
        optionTintColor="white"
      />
    );
  };
  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: "black",
          },
          right: {
            color: "white",
          },
        }}
      />
    );
  };

  return (
    <View>
      <View
        style={[
          nombreSala == "uno" && styles.headerTopUno,
          nombreSala == "dos" && styles.headerTopDos,
        ]}
      >
        <StyledTouchableHighlight
          style={styles.btnVolver}
          btnVolverHome
          onPress={() => props.onVolver()}
        >
          Volver
        </StyledTouchableHighlight>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 0.7,
          }}
        >
          <StyledText
            fontSize={"subHeading"}
            style={[
              nombreSala == "uno" && styles.headerUno,
              nombreSala == "dos" && styles.headerDos,
            ]}
          >
            {nombreSala == "uno" ? "Sala 4°A" : "Sala 4°B"}
          </StyledText>
        </View>
      </View>
      {spinner && (
        <View
          style={[
            nombreSala == "uno" && styles.spinnerContainerUno,
            nombreSala == "dos" && styles.spinnerContainerDos,
          ]}
        >
          <ActivityIndicator
            size={180}
            color={
              nombreSala == "uno"
                ? theme.colores.secondary
                : theme.colores.detaile2
            }
          />
        </View>
      )}
      <GiftedChat
        dateFormat="LL"
        locale={AR}
        renderComposer={renderComposer}
        renderInputToolbar={renderInputToolbar}
        renderTime={renderTime}
        renderUsernameOnMessage={true}
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={(messages) => onSend(messages)}
        renderSend={renderSend}
        messagesContainerStyle={[
          nombreSala == "uno" && styles.messagesContainerUno,
          nombreSala == "dos" && styles.messagesContainerDos,
        ]}
        textInputStyle={styles.input}
        user={{
          _id: auth.currentUser.email,
        }}
        renderBubble={renderBubble}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerUno: {
    color: "black",
  },
  inputToolBarUno: {
    backgroundColor: theme.colores.secondary,
  },
  inputToolBarDos: {
    backgroundColor: theme.colores.detaile2,
  },
  headerDos: {
    color: "black",
  },
  input: {
    color: "white",
  },
  messagesContainerUno: {
    backgroundColor: theme.colores.secondaryLight,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.78,
    justifyContent: "flex-end",
  },
  messagesContainerDos: {
    backgroundColor: theme.colores.primary,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.78,
    justifyContent: "flex-end",
  },
  spinnerContainerUno: {
    backgroundColor: theme.colores.secondaryLight,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.84,
    justifyContent: "center",
  },
  spinnerContainerDos: {
    backgroundColor: theme.colores.primary,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.84,
    justifyContent: "center",
  },
  headerTopUno: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.105,
    backgroundColor: theme.colores.secondaryLight,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  headerTopDos: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.105,
    backgroundColor: theme.colores.primary,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  burbujaRightUno: {
    backgroundColor: "#7dbd6c",
  },
  burbujaLeftUno: {},
  burbujaRightDos: { backgroundColor: "#7dbd6c" },
  burbujaLeftDos: {},
  btnVolver: {},
});

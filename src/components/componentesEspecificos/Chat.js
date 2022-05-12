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
          right: {
            backgroundColor: theme.colores.detaile2,
          },
          left: {
            backgroundColor: theme.colores.secondary,
          },
        }}
        textStyle={{
          right: {
            color: "white",
          },
          left: {
            color: theme.colores.detaile2,
          },
        }}
        usernameStyle={{ color: "grey" }}
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
        placeholderTextColor={theme.colores.primary}
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
        primaryStyle={{
          backgroundColor: theme.colores.detaile2,
          color: "white",
        }}
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
    // <>
    //   {messages.map(message => (
    //     <Text key={message._id}>{message.text}</Text>
    //   ))}<
    // </>
    <View>
      <View style={styles.header}>
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
          <StyledText fontSize={"subHeading"}>Sala: {nombreSala}</StyledText>
        </View>
      </View>
      {spinner && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={180} color={theme.colores.details} />
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
        messagesContainerStyle={styles.messagesContainer}
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
  input: {
    color: "white",
  },
  messagesContainer: {
    backgroundColor: theme.colores.primary,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.78,
    justifyContent: "flex-end",
  },
  spinnerContainer: {
    backgroundColor: theme.colores.primary,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.84,
    justifyContent: "center",
  },
  header: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.105,
    backgroundColor: theme.colores.primary,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  btnVolver: {},
});

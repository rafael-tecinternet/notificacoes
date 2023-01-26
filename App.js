import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Button,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
/* manipulador de eventos de noticidcação */
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    };
  },
});

export default function App() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    /* Necessário para IOS */
    async function permissoesIos() {
      return await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
          allowAnnouncements: true,
        },
      });
    }
    permissoesIos();

    /* Obter as permissões atuais do dispositivo */
    Notifications.getPermissionsAsync().then((status) => {
      if (status.granted) {
        /* Permissões ok ? Então vamos obter o token do expo do aparelho */
        Notifications.getExpoPushTokenAsync().then((token) => {
          console.log(token);
        });
      }
    });

    /* Ouvinte de evento para as notificações recebidas, ou seja, q
    uando a notificação aparece no topo da tela do dispositivo. */
    Notifications.addNotificationReceivedListener((notificacao) => {
      console.log(notificacao);
    });

    /* Ouvinte de evento para as respostas dadas às notificações, ou seja
    quando o usuário interage (toca) na notificação. */
    Notifications.addNotificationResponseReceivedListener((resposta) => {
      console.log(resposta.notification.request.content.data);
      setDados(resposta.notification.request.content.data);
    });
  }, []);

  const enviarMensagem = async () => {
    const mensagem = {
      title: "Lembrete!",
      body: "Não esqueça de tomar água!",
      data: { usuario: "Sr. Rafael", cidade: "São Paulo" },
      sound: Platform.OS === "ios" ? "default" : "" /* necessário para ios */,
    };
    /* Função de agendamento de notificações */
    await Notifications.scheduleNotificationAsync({
      content: mensagem,
      trigger: { seconds: 5 },
    });
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={estilos.container}>
        <Text>Exemplo de sistema de notificação local</Text>
        <Button title="Disparar notificação" onPress={enviarMensagem} />
        {dados && (
          <View style={estilos.conteudo}>
            <Text>{dados.usuario}</Text>
            <Text>{dados.cidade}</Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: {
    backgroundColor: "yellow",
    marginVertical: 16,
    padding: 8,
  },
});

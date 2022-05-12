import * as Font from "expo-font";
import { Kanit_400Regular } from "@expo-google-fonts/kanit";

export default useFonts = async () => {
  await Font.loadAsync({
    Kanit_400Regular: Kanit_400Regular,
  });
};

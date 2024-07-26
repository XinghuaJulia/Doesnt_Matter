import { StyleSheet } from "react-native";
import { COLORS } from "./theme";

export default StyleSheet.create({
    container: {
      height: 240,
      marginBottom: 18,
      backgroundColor: COLORS.white,
      borderRadius: 24,
      marginHorizontal: 16,
    },
    imageContainer: {flex: 1},
    image: {
      flex: 1,
      borderRadius: 24,
      height: 300,
    },
    titleContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      height: 160,
      paddingLeft: 16,
      paddingRight: 10,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    text: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      paddingBottom: 24,
      marginHorizontal: 10, 
    },
    timestamp: {
      position: 'absolute',
      color: COLORS.gray,
      fontSize: 12,
      fontWeight: '300',
      right: 16,
      bottom: 8,
    },
  });
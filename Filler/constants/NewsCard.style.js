import { StyleSheet } from "react-native";

import { SIZES, COLORS } from "./theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    margin: 10,
  },
  horizontalContainer: {
    marginTop:5,
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  descTitle: {
    color: COLORS.gray,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
  },
  newsImage: {
    width: 100,
    height: 60,
    borderRadius: 10,
  },
});

export default styles;
import { StyleSheet } from "react-native";

import { SIZES, COLORS } from "./theme";

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.xLarge,
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.large,
    color: COLORS.primary,
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
  },
});

export default styles;
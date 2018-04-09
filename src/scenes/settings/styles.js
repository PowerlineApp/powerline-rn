import ScaleSheet from "react-native-scalesheet";

export default ScaleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  wrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  item: {
    width: "30%",
    height: "25vh",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "3%"
  },
  iconContainer: {
    width: "15vh",
    height: "15vh",
    borderRadius: "7.5vh",
    backgroundColor: "#5559A1",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 15
  }
});

import ScaleSheet from "react-native-scalesheet";

export default ScaleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFF4"
  },
  description: {
    fontSize: 15,
    marginVertical: 15,
    paddingHorizontal: 20,
    fontColor: "#C0C0C0",
    textAlign: "center"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "white",
    borderBottomColor: "#DDD",
    borderBottomWidth: 1
  },
  itemFirst: {
    borderTopColor: "#DDD",
    borderTopWidth: 1
  },
  itemLabel: {
    flex: 2,
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 20
  },
  itemActionContainer: {
    flex: 3,
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 20
  },
  itemValue: {
    fontSize: 16,
    color: "#A6A6A6"
  },
  backdrop: {
    backgroundColor: "black",
    opacity: 0.5
  }
});

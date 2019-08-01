import ScaleSheet from "react-native-scalesheet";
const PLColors = require("../../../common/PLColors");

export default ScaleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  description: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30,
    marginVertical: 15
  },
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 80,
    alignItems: "center",
    justifyContent: "center"
  },
  itemAvatar: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    borderRadius: 30
  },
  itemInfoContainer: {
    flex: 1,
    flexDirection: "row",
    height: 80,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#D6D6D6"
  },
  itemLabel: {
    fontSize: 18,
    color: "black"
  },
  itemSubLabel: {
    color: "#898A8B"
  },
  header: {
    backgroundColor: PLColors.main
  },
  cardIcon: {
    fontSize: 60,
    marginLeft: 20
  },
  numberGroup: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5
  },
  mask: {
    fontSize: 30
  },
  deleteIcon: {
    marginRight: 20,
    fontSize: 35
  }
});

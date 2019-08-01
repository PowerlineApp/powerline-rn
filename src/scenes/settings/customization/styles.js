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
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  itemInfoContainer: {
    flex: 1,
    height: 80,
    marginLeft: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D6D6D6"
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10
  },
  headerLabel: {
    fontSize: 16,
    paddingVertical: 5
  },
  header: {
    backgroundColor: PLColors.main
  },
  deleteIcon: {
    marginRight: 20,
    fontSize: 26
  }
});

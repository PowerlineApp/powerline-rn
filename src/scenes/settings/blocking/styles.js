import ScaleSheet from "react-native-scalesheet";
const PLColors = require("../../../common/PLColors");

export default ScaleSheet.create({
  container: { flex: 1 },
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
    height: 80,
    marginLeft: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D6D6D6"
  },
  itemLabel: {
    fontSize: 18,
    color: "black"
  },
  itemSubLabel: {
    fontSize: 14,
    color: "#898A8B"
  },
  header: {
    backgroundColor: PLColors.main
  },
  searchBar: {
    backgroundColor: "#030747",
    paddingHorizontal: 10,
    marginLeft: 0,
    color: "white"
  },
  searchInput: {
    fontSize: 14,
    color: "white"
  },
  searchIcon: {
    color: "white"
  }
});

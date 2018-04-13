import ScaleSheet from "react-native-scalesheet";
const PLColors = require("PLColors");

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
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  itemLabel: {
    fontSize: 15,
    marginLeft: 5
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10
  },
  header: {
    backgroundColor: PLColors.main
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20
  },
  section: {
    marginTop: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#C7C7C7"
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#C7C7C7",
    backgroundColor: "#F1F7F9",
    paddingLeft: 20,
    paddingVertical: 14
  },
  sectionHeaderLabel: {
    fontSize: 15,
    color: "#637f9d"
  },
  switchBox: {
    flexDirection: "row",
    height: 60,
    width: "100%",
    borderWidth: 1,
    borderColor: "#C7C7C7",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  toggleIcon: {
    color: "#61C1FF",
    fontSize: 36
  },
  togglePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#61C1FF"
  }
});

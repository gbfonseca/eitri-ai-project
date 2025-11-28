import Eitri from "eitri-bifrost";
import { Vtex } from "eitri-shopping-vtex-shared";
import { resolveNavigation } from "../../services/NavigationService";
import ListWithImages from "./components/ListWithImages";
import SimpleList from "./components/SimpleList";

export default function CategoryTree(props) {
  const { data } = props;

  const [currentShelf, setCurrentShelf] = useState(null);

  const legacySearch = Vtex?.configs?.searchOptions?.legacySearch;

  useEffect(() => {
    if (data?.shelfs) {
      setCurrentShelf(data.shelfs[0]);
    }
  }, [data?.shelfs]);

  const onChooseShelf = (shelf) => {
    setCurrentShelf(shelf);
  };

  const chooseCategory = (category) => {
    if (legacySearch) {
      Eitri.navigation.navigate({
        path: "ProductCatalog",
        state: {
          facets: category.facets,
          title: category.title,
        },
      });
      return;
    }
    console.log("chooseCategory >> legacySearch >>", category);
    resolveNavigation(category.facets, category.title);
  };

  return (
    <View>
      {(data.shelfs?.length > 1 ||
        (data.shelfs?.length === 1 && data.shelfs[0].title)) && (
        <View
          overflowX="auto"
          display="flex"
          paddingHorizontal={"large"}
          marginBottom="large"
          gap="8px"
        >
          {data.shelfs?.map((shelf) => (
            <>
              {shelf.title && (
                <Touchable
                  key={shelf.title}
                  minWidth="fit-content"
                  paddingHorizontal="small"
                  paddingVertical="nano"
                  borderWidth="hairline"
                  borderRadius="small"
                  onPress={() => onChooseShelf(shelf)}
                  borderColor={
                    shelf.title === currentShelf.title
                      ? "secondary-500"
                      : "neutral-500"
                  }
                  backgroundColor={
                    shelf.title === currentShelf.title
                      ? "secondary-500"
                      : "neutral-100"
                  }
                >
                  <Text
                    color="primary-100"
                    fontFamily="Barlow"
                    fontWeight="bold"
                    fontSize="nano"
                  >
                    {shelf.title}
                  </Text>
                </Touchable>
              )}
            </>
          ))}
        </View>
      )}

      {currentShelf &&
        (currentShelf.showAsSimpleItem ? (
          <SimpleList
            currentShelf={currentShelf}
            chooseCategory={chooseCategory}
          />
        ) : (
          <ListWithImages
            currentShelf={currentShelf}
            chooseCategory={chooseCategory}
          />
        ))}
    </View>
  );
}

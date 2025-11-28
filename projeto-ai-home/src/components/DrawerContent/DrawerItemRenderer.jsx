import Eitri from "eitri-bifrost";
import { CollapsableDrawer } from "projeto-ai-shared";
import { resolveNavigation } from "../../services/NavigationService";

export default function DrawerItemRenderer(props) {
  const { content, page, isOpen, onToggle } = props;

  const [openSubcategory, setOpenSubcategory] = useState(null);

  const handleCollectionAction = (value, title) => {
    Eitri.navigation.navigate({
      path: "ProductCatalog",
      state: {
        facets: `productClusterIds/${value}`,
        title: title,
      },
    });
  };

  const executeAction = (action) => {
    if (!action) return;

    // console.log("action", action);
    const { title, type, value } = action;

    switch (type) {
      case "collection":
        handleCollectionAction(action.value, action.title);
        break;
      case "path":
        resolveNavigation(value, title);
        break;
      default:
        console.log(`Unknown action type: ${type}`);
    }
  };

  const renderSubSubcategories = (subSubcategories) => (
    <View
      display="flex"
      direction="column"
      gap={16}
      paddingLeft="small"
      marginVertical="small"
    >
      {subSubcategories.map((subsub) => (
        <Touchable
          key={subsub.title}
          gap={8}
          display="flex"
          alignItems="center"
          onPress={() => executeAction(subsub?.action)}
        >
          <View display="flex" alignItems="center" gap={16}>
            {subsub?.imageUrl && <Image src={subsub.imageUrl} width={16} />}
            <Text
              fontWeight="bold"
              color="accent-500"
              textTransform="uppercase"
            >
              {subsub.title}
            </Text>
          </View>
        </Touchable>
      ))}
    </View>
  );

  if (content?.subcategories) {
    return (
      <CollapsableDrawer
        key={content.title}
        title={content.title}
        imageUrl={content?.imageUrl}
        willStartCollapsed={true}
        isCollapsed={!isOpen}
        onToggle={onToggle}
      >
        <View
          display="flex"
          direction="column"
          gap={16}
          paddingLeft="small"
          marginVertical="small"
        >
          {content.subcategories.map((subcategory) =>
            subcategory?.subSubcategories ? (
              <CollapsableDrawer
                key={subcategory.title}
                title={subcategory.title}
                imageUrl={subcategory?.imageUrl}
                willStartCollapsed
                subCategory
                isCollapsed={openSubcategory !== subcategory.title}
                onToggle={() =>
                  setOpenSubcategory((prev) =>
                    prev === subcategory.title ? null : subcategory.title
                  )
                }
              >
                {renderSubSubcategories(subcategory.subSubcategories)}
              </CollapsableDrawer>
            ) : (
              <Touchable
                key={subcategory.title}
                gap={8}
                display="flex"
                alignItems="center"
                onPress={() => executeAction(subcategory?.action)}
              >
                <View display="flex" alignItems="center" gap={16}>
                  {subcategory?.imageUrl && (
                    <Image src={subcategory.imageUrl} width={16} />
                  )}

                  <Text
                    fontWeight="bold"
                    color="accent-500"
                    textTransform="uppercase"
                  >
                    {subcategory.title}
                  </Text>
                </View>
              </Touchable>
            )
          )}
        </View>
      </CollapsableDrawer>
    );
  }

  return (
    <Touchable
      display="flex"
      alignItems="center"
      borderBottomWidth="hairline"
      borderBottom="solid"
      borderColor="primary-300"
      width="100%"
      height={48}
      gap={16}
      onPress={() => executeAction(content?.action)}
    >
      <Image src={content?.imageUrl} width={16} />

      <Text fontWeight="bold" fontSize="small" textTransform="uppercase">
        {content?.title}
      </Text>
    </Touchable>
  );
}

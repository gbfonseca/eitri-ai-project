import arrow_right from "../../assets/icons/arrow-right.svg";
// import { cmsActionsExecutor } from "../../services/CmsService";
import {
  CollapsableDrawer,
  HeaderSearchIcon,
} from "projeto-ai-shared";
import { logEvent } from "../../services/TrackingService";
import GAEvents from "../../utils/GAEvents";
import DrawerItemRenderer from "./DrawerItemRenderer";

export default function DrawerContent(props) {
  const { data, closeDrawer, page, startParams, navigateToSearch } = props;

  const executeAction = (content) => {
    // cmsActionsExecutor(content);
    logEvent(page, GAEvents.NAVIGATION, {
      origin: `Drawer:${content?.title}`,
      destiny: content?.value,
    });
  };

  const [openCategory, setOpenCategory] = useState(null);
  const drawerContent = data?.drawerContent;
  const drawerContentSecondary = data?.drawerContentSecondary;
  const drawerFooterContent = data?.drawerFooterContent;

  const drawerContentUsed = drawerContentSecondary
    ? drawerContentSecondary
    : drawerContent;

  // console.log("DATA", drawerContentSecondary);

  return (
    <View
      display="flex"
      direction="column"
      justifyContent="between"
      grow={1}
      width="100%"
      height="80vh"
    >
      <View width="100%">
        <View display="flex" alignItems="center" justifyContent="between">
          {drawerContentUsed?.mainTitle && (
            <View>
              <Text
                fontFamily="Baloo 2"
                fontWeight="bold"
                fontSize="extra-large"
              >
                {drawerContentUsed.mainTitle}
              </Text>
            </View>
          )}

          <View display="flex" alignItems="center" width="82vw">
            <HeaderSearchIcon
              onPress={navigateToSearch}
              marginBottom="none"
              marginTop="none"
            />
          </View>

          <Touchable onPress={closeDrawer}>
            <Image src={arrow_right} width="24px" />
          </Touchable>
        </View>

        <View
          display="flex"
          direction="column"
          marginTop="giant"
          height="83vh"
          overflowY="scroll"
        >
          {drawerContentUsed?.content?.map((content, index) => {
            return (
              <View key={index + 1} display="flex">
                <DrawerItemRenderer
                  content={content}
                  page={page}
                  isOpen={openCategory === content.title}
                  onToggle={() =>
                    setOpenCategory((prev) =>
                      prev === content.title ? null : content.title
                    )
                  }
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* FOOTER */}
      <View width="100%" display="flex" direction="column">
        <Text fontWeight="bold" marginBottom="large">
          {drawerFooterContent?.mainTitle}
        </Text>
        <View display="flex" gap="20px">
          {drawerFooterContent?.content?.map((content, index) => (
            <Touchable key={index} onPress={() => executeAction(content)}>
              <Image src={content.imageUrl} />
            </Touchable>
          ))}
        </View>
      </View>
    </View>
  );
}

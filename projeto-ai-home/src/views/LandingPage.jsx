import Eitri from "eitri-bifrost";
import { openCart } from "../services/NavigationService";
import {
  Loading,
  HeaderSearchIcon,
  HeaderCart,
  HeaderContentWrapper,
  HeaderText,
  HeaderReturn,
} from "projeto-ai-shared";
import { useLocalShoppingCart } from "../providers/LocalCart";
import { getCmsContent } from "../services/CmsService";
import { getMappedComponent } from "../utils/getMappedComponent";
import { useTranslation } from "eitri-i18n";
import { logScreenView } from "../services/TrackingService";

export default function LandingPage(props) {
  const [cmsContent, setCmsContent] = useState(null);
  const [ladingPageLogo, setLadingPageLogo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const landingPageName = props?.location?.state?.landingPageName;
  const { t } = useTranslation();

  const loadCms = async () => {
    try {
      const { sections, settings } = await getCmsContent(
        "landingPage",
        landingPageName
      );
      setCmsContent(sections);
      setLadingPageLogo(settings?.imageLogo?.logoUrl);
      setIsLoading(false);

      const startParams = await Eitri.getInitializationInfos();
      if (!Number(startParams?.tabIndex)) {
        logScreenView(`landingPage ${landingPageName}`, "LandingPage");
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCms();

    Eitri.navigation.setOnResumeListener(() => {
      logScreenView(`landingPage ${landingPageName}`, "LandingPage");
    });
  }, []);

  const { cart } = useLocalShoppingCart();

  const navigateToCart = () => {
    openCart(cart);
  };

  const navigateToSearch = () => {
    Eitri.navigation.navigate({ path: "Search" });
  };

  return (
    <Window title="Ofertas" bottomInset topInset>
      {props?.location?.state?.tabIndex ? (
        <HeaderContentWrapper>
          <HeaderText text={props?.location?.state?.pageTitle ?? ""} />
        </HeaderContentWrapper>
      ) : (
        <HeaderContentWrapper justifyContent="between" alignItems="center">
          <View display="flex" gap={16} alignItems="center" width="100%">
            <HeaderReturn />

            <HeaderText
              text={props?.location?.state?.pageTitle ?? ""}
              textTransform="uppercase"
            />
          </View>

          <View display="flex" gap={16}>
            <HeaderSearchIcon onPress={navigateToSearch} />

            <HeaderCart cart={cart} onPress={navigateToCart} />
          </View>
        </HeaderContentWrapper>
      )}

      <Loading fullScreen isLoading={isLoading} />

      <View paddingVertical="large" direction="column" gap="32px">
        {ladingPageLogo && (
          <View
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={ladingPageLogo} maxHeight="52px" />
          </View>
        )}

        {cmsContent?.map((content) => getMappedComponent(content))}
      </View>
    </Window>
  );
}

import { getRemoteAppConfigProperty } from "../../utils/getRemoteConfigStyleProperty";
import { DIMENSIONS, TOKENS_DEFAULT } from "../../utils/constants";
import HeaderOffset from "./HeaderOffset";

export default function HeaderContentWrapper(props) {
  const {
    backgroundColor,
    children,
    paddingVertical,
    paddingHorizontal,
    scrollEffect,
    scrollEffectMaxTranslate,
    height,
    safeAreaTopProps,
    ...rest
  } = props;

  const [_backgroundColor, setBackgroundColor] = useState(
    backgroundColor || TOKENS_DEFAULT.HEADER_BACKGROUND_COLOR
  );
  const [safeAreaTop, setSafeAreaTop] = useState(0);
  const [translate, setTranslate] = useState("");

  const safeAreaTopRef = useRef();
  const scrollHandler = useRef();

  safeAreaTopRef.current = safeAreaTop;

  let _height = height || DIMENSIONS.HEADER_HEIGHT;

  useEffect(() => {
    loadRemoteConfigsOptions();
    initScrollEffect();
  }, []);

  const loadRemoteConfigsOptions = async () => {
    if (backgroundColor) return;
    const headerBackgroundColor = await getRemoteAppConfigProperty(
      "headerBackgroundColor"
    );
    if (headerBackgroundColor) {
      setBackgroundColor(headerBackgroundColor);
    }
  };

  const initScrollEffect = async () => {
    if (typeof scrollEffect === "boolean" && !scrollEffect) return;

    if (!scrollEffect) {
      const headerScrollEffect = await getRemoteAppConfigProperty(
        "headerScrollEffect"
      );
      if (!headerScrollEffect) {
        return;
      }
    }
    loadSafeAreas();
    window.addEventListener("scroll", scrollHandler.current);
    return () => {
      window.removeEventListener("scroll", scrollHandler.current);
    };
  };

  const loadSafeAreas = async () => {
    const { EITRI } = window;
    if (EITRI) {
      const { superAppData } = await EITRI.miniAppConfigs;
      const { safeAreaInsets } = superAppData;
      const { top } = safeAreaInsets;
      setSafeAreaTop(top);
    }
  };

  let ticking = false;
  let lastScrollTop = window.document.documentElement.scrollTop;

  if (!scrollHandler.current) {
    scrollHandler.current = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let currentScrollTop = window.document.documentElement.scrollTop;

          if (currentScrollTop > lastScrollTop) {
            setTranslate(`translateY(${scrollEffectMaxTranslate || "-100%"})`);
          } else if (currentScrollTop < lastScrollTop) {
            setTranslate("");
          }

          lastScrollTop = Math.max(currentScrollTop, 0);

          ticking = false;
        });

        ticking = true;
      }
    };
  }

  return (
    <>
      <View
        backgroundColor={_backgroundColor}
        id="header-container"
        position={"fixed"}
        transform={translate || ""}
        transition="all 0.5s ease-in-out"
        top={0}
        left={0}
        right={0}
        zIndex="999"
        elevation="low"
      >
        <View topInset />
        <View id="header">
          <View
            id="header-content"
            width="100vw"
            paddingVertical={paddingVertical || "extra-small"}
            paddingHorizontal={paddingHorizontal || "large"}
            display="flex"
            alignItems="center"
            minHeight={_height}
            backgroundColor={_backgroundColor}
            {...rest}
          >
            {children}
          </View>
        </View>
      </View>

      <View
        topInset
        position="fixed"
        width="100%"
        top={0}
        zIndex={2000}
        backgroundColor={_backgroundColor}
      />
      <HeaderOffset height={_height} safeAreaTop={safeAreaTopProps ? safeAreaTopProps : safeAreaTop} />
    </>
  );
}

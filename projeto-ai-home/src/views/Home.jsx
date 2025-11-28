import Eitri from "eitri-bifrost";
import { useLocalShoppingCart } from "../providers/LocalCart";
import HomeTemplate from "../components/templates/HomeTemplate";
import { getCmsContent } from "../services/CmsService";
import { normalizePath, openCart } from "../services/NavigationService";
import { setLanguage, startConfigure } from "../services/AppService";
import { useTranslation } from "eitri-i18n";
import Header from "../components/Header/Header";
import { logScreenView } from "../services/TrackingService";

export default function Home() {
  const { cart, startCart } = useLocalShoppingCart();

  const [cmsContent, setCmsContent] = useState(null);
  const [drawerContent, setDrawerContent] = useState(null);
  const [startParams, setStartParams] = useState("");

  const [key, setKey] = useState(new Date().getTime());

  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scroll(0, 0);

    startHome();
    requestNotificationPermission();

    Eitri.navigation.setOnResumeListener(() => {
      startCart();

      // envia ao clicar na bottomBar
      logScreenView(`Home`, "Home")
    });
  }, []);

  const requestNotificationPermission = async () => {
    try {
      let notificationPermissionStatus =
        await Eitri.notification.checkPermission();

      if (notificationPermissionStatus.status === "DENIED") {
        await Eitri.notification.requestPermission();
      }
    } catch (e) {
      console.error("Erro ao solicitar permissão para notificação", e);
    }
  };

  const startHome = async () => {
    startConfigure()
      .then((_) => {
        setLanguage(i18n);
        resolveRedirectAndCartAndCms();
      })
      .catch((e) => {
        console.error("Error startConfigure: ", e);
      });

    Eitri.navigation.setOnResumeListener(() => {
      const currentTime = new Date().getTime();
      setKey(currentTime);
    });
  };

  const resolveRedirectAndCartAndCms = async () => {
    const startParams = await Eitri.getInitializationInfos();

    if (startParams) {
      setStartParams(startParams);

      const openRoute = processDeepLink(startParams);
      if (openRoute) {
        Eitri.navigation.navigate({ ...openRoute });
        return;
      }
    }

    loadCms();
    startCart();

    // envia ao entrar no app, previne envio caso outra aba esteja aberta pela bottomBar
    if (!Number(startParams?.tabIndex) || startParams?.tabIndex === 0) {
      logScreenView(`Home`, "Home")
    }

  };

  const processDeepLink = (startParams) => {
    if (startParams?.route) {
      let { route, ...rest } = startParams;
      if (rest?.searchTerm) {
        const normalizedPath = normalizePath(rest.searchTerm);
        return {
          path: route,
          replace: true,
          state: { params: normalizedPath, title: rest.title || "", ...rest },
        };
      }

      return { path: route, state: rest, replace: true };
    }

    const tabIndex = startParams?.tabIndex;
    if (tabIndex || (typeof tabIndex === "number" && tabIndex >= 0)) {
      const parsedTabIndex = parseInt(tabIndex);

      if (parsedTabIndex === 1) {
        return { replace: true, path: "/Categories" };
      }

      if (parsedTabIndex === 3) {
        return {
          replace: true,
          path: "/LandingPage",
          state: { landingPageName: t("home.offers") },
        };
      }

      if (parsedTabIndex === 4) {
        return {
          replace: true,
          path: "/LandingPage",
          state: { landingPageName: t("home.offers") },
        };
      }
    }
  };

  const loadCms = async () => {
    const { sections, drawer } = await getCmsContent("home", "home");
    setCmsContent(sections);
    setDrawerContent(drawer);
  };

  const navigateCart = () => {
    openCart(cart);
  };

  const navigateToSearch = () => {
    Eitri.navigation.navigate({ path: "Search" });
  };

  return (
    <Window title="Home" topInset bottomInset>
      <View backgroundColor="primary-500">
        <Header
          cart={cart}
          navigateToCart={navigateCart}
          navigateToSearch={navigateToSearch}
          drawerContent={drawerContent}
          startParams={startParams}
          safeAreaTop={120}
        />

        {/* SKELETON */}
        <View padding="large" display={cmsContent ? "none" : "block"}>
          <View direction="column" gap={16}>
            <View
              mode="skeleton"
              width="100%"
              height="100vw"
              borderRadius="small"
            />
            <View direction="row" gap={16}>
              <View
                mode="skeleton"
                width="100%"
                height={80}
                borderRadius="small"
              />
              <View
                mode="skeleton"
                width="100%"
                height={80}
                borderRadius="small"
              />
              <View
                mode="skeleton"
                width="100%"
                height={80}
                borderRadius="small"
              />
            </View>
            <View
              mode="skeleton"
              width="100%"
              height="100vw"
              borderRadius="small"
            />
          </View>
        </View>

        <HomeTemplate
          reloadKey={key}
          isReady={cmsContent}
          cmsContent={cmsContent}
        />
      </View>
    </Window>
  );
}

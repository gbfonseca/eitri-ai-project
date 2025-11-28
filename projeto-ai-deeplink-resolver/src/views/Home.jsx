import Eitri from "eitri-bifrost";
import {
  openProduct,
  openHome,
  openProductBySlug,
  openEitriApp,
} from "../services/NavigationService";
import { getProductBySlug } from "../services/ProductService";
import { Vtex, App } from "eitri-shopping-vtex-shared";
import { Loading } from "projeto-ai-shared";
import { deeplinkActionsExecutor } from "../services/NotificationDeepLinkService";

export default function Home(props) {
  useEffect(() => {
    startHome();
  }, []);

  const startHome = async () => {
    await loadConfigs();
    await resolveContent();
  };

  const loadConfigs = async () => {
    try {
      await App.tryAutoConfigure({ verbose: false });
    } catch (error) {
      console.error("Erro ao buscar configurações", error);
    }
  };

  const resolveContent = async () => {
    try {
      const startParams = await Eitri.getInitializationInfos();
      if (!startParams) {
        console.error("Nenhum parâmetro de inicialização encontrado.");
        Eitri.close();
        return;
      }

      await processStartParams(startParams);
    } catch (error) {
      console.error("Erro ao resolver parâmetros de inicialização:", error);
      Eitri.close();
    }
  };

  async function resolveDeeplinkUtmParams(startParams) {
    const utmParams = Object.fromEntries(
      Object.entries(startParams).filter(([key]) => key.includes("utm"))
    );

    await saveUtmParams(utmParams);
  }

  const processStartParams = async (startParams) => {
    try {
      const { action, value, title } = startParams;

      if (action && value) {
        await resolveDeeplinkUtmParams(startParams);

        deeplinkActionsExecutor({
          action: action,
          value: value,
          title: title || "",
        });
        return;
      }

      if (!startParams?.deeplink) {
        Eitri.close();
        throw new Error("Nenhum deeplink encontrado");
      }

      const [, queryParams] = startParams.deeplink.split("?");

      try {
        await resolveUtmParams(queryParams);
      } catch (e) {
        console.error("Erro ao salvar os parâmetros UTM", e);
      }

      const deeplinkWays = [
        resolveDeeplinkFromRemoteConfig,
        resolveDeeplinkToProduct,
        resolveDeeplinkToProductCatalog,
      ];

      resolveDeeplink(startParams, deeplinkWays);
    } catch (error) {
      console.error("Erro ao processar os parametros de inicializacao", error);
      Eitri.close();
    }
  };

  const resolveUtmParams = async (queryParams) => {
    if (!queryParams) return;
    const paramsArray = queryParams.split("&");
    const paramsObject = {};
    paramsArray.forEach((param) => {
      const [key, value] = param.split("=");
      if (key.startsWith("utm")) {
        paramsObject[key] = value;
      }
    });

    await saveUtmParams(paramsObject);
  };

  const saveUtmParams = async (params) => {
    return Vtex.customer.saveUtmParams(params);
  };

  const resolveDeeplink = async (startParams, deeplinkWays) => {
    try {
      for (const way of deeplinkWays) {
        try {
          let result = await way(startParams);
          if (result) {
            return true;
          }
        } catch (error) {
          console.error("Erro ao processar o deep link", error);
        }
      }

      openBrowser(startParams);
    } catch (error) {
      console.error("Erro ao processar o deep link", error);
      Eitri.close();
    }
  };

  const resolveDeeplinkToProduct = async (startParams) => {
    try {
      let { deeplink } = startParams;
      const [baseUrl] = deeplink.split("?");

      if (baseUrl.toLowerCase().endsWith("/p")) {
        const urlParts = baseUrl.split("/");
        const productSlug = urlParts[urlParts.length - 2];
        const product = await getProductBySlug(productSlug);

        if (product && product[0]?.productId) {
          openProduct(product[0]);
          return true;
        }
      } else {
        const slug = startParams.deeplink;
        openProductBySlug(slug);
      }
      return false;
    } catch (error) {
      console.error("Erro ao processar o deep link do produto", error);
      return false;
    }
  };

  const resolveDeeplinkToProductCatalog = (startParams) => {
    const [baseUrl, queryParams] = startParams.deeplink.split("?");
    try {
      if (
        startParams?.deeplink?.includes("&map=") ||
        startParams?.deeplink?.includes("?map=")
      ) {
        const paramsArray = queryParams.split("&");
        const paramsObject = {};
        let mapValues = [];

        paramsArray.forEach((param) => {
          const [key, value] = param.split("=");
          if (key === "map") {
            mapValues = decodeURIComponent(value).split(",");
          } else {
            paramsObject[key] = value;
          }
        });

        if (mapValues.length > 0) {
          const pathSegments = baseUrl
            .replace(/^@?https:\/\/www\.blackskullusa\.com\.br\//, "")
            .split("#")[0]
            .split("/");

          const facets = mapValues.map((mapValue, index) => ({
            key: mapValue,
            value: pathSegments[index] || "",
          }));
          openHome({ deeplinkFacets: facets });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Erro ao processar o deep link de busca", error);
      return false;
    }
  };

  const resolveDeeplinkFromRemoteConfig = (startParams) => {
    const rcDeeplinkConfig = App?.configs?.deeplink;

    if (!rcDeeplinkConfig?.deeplinkMap) {
      return false;
    }

    const matchedDeeplink = rcDeeplinkConfig.deeplinkMap.find((deeplink) => {
      return deeplink.path.some(
        (path) => startParams.deeplink.indexOf(path) > -1
      );
    });

    if (matchedDeeplink) {
      openEitriApp(matchedDeeplink.slug, matchedDeeplink.params);
      return true;
    } else {
      return false;
    }
  };

  const openBrowser = async (startParams) => {
    try {
      let { deeplink } = startParams;

      const { applicationData } = await Eitri.getConfigs();

      let url =
        applicationData.platform === "ios"
          ? deeplink
          : `https://faststore-cms.s3.us-east-1.amazonaws.com/redirect.html?link=${btoa(
              deeplink
            )}`;

      Eitri.openBrowser({
        url: url,
        inApp: false,
      });
      Eitri.close();
    } catch (error) {
      console.error("Erro ao processar o deep link de busca", error);
      Eitri.close();
    }
  };

  return (
    <Window
      bottomInset
      backgroundColor="neutral-100"
      statusBarTextColor="white"
    >
      <View
        position="fixed"
        top="45%"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Loading />
      </View>
    </Window>
  );
}

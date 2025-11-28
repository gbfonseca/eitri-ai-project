import {
  CustomButton,
  HeaderText,
  HeaderContentWrapper,
  Loading,
} from "projeto-ai-shared";
import {
  doLogout,
  getCustomerData,
  isLoggedIn,
} from "../services/CustomerService";
import { navigate, PAGES } from "../services/NavigationService";
import { sendPageView } from "../services/TrackingService";
import { useTranslation } from "eitri-i18n";
import iconLogout from "../assets/icons/logout-icon.svg";
import Eitri from "eitri-bifrost";
import ProfileCardButton from "../components/ProfileCardButton/ProfileCardButton";
import PoweredBy from "../components/PoweredBy/PoweredBy";
import { setLanguage, startConfigure } from "../services/AppService";

import myOrdersIcon from "../assets/icons/my-orders-icon.svg";
import userIcon from "../assets/icons/user-icon.svg";
import heartIcon from "../assets/icons/heart-icon.svg";
import supportIcon from "../assets/icons/support-icon.svg";
import termsConditionsIcon from "../assets/icons/terms-condition-icon.svg";
import blogIcon from "../assets/icons/blog-icon.svg";
import settingsIcon from "../assets/icons/settings-icon.svg";

export default function Home(props) {
  const PAGE = "Minha Conta";

  const dataMenu = [
    {
      icon: myOrdersIcon,
      name: "home.menuItens.myOrders.name",
      description: "home.menuItens.myOrders.description",
      onPress: () => navigate(PAGES.ORDER_LIST),
    },
    {
      icon: userIcon,
      name: "home.menuItens.myAccount.name",
      description: "home.menuItens.myAccount.description",
      onPress: () => navigate(PAGES.SETTINGS),
    },
    {
      icon: heartIcon,
      name: "home.menuItens.myFavorites.name",
      description: "home.menuItens.myFavorites.description",
      onPress: () => navigate(PAGES.WISH_LIST)
    },
    {
      icon: supportIcon,
      name: "home.menuItens.support.name",
      description: "home.menuItens.support.description",
      onPress: () => Eitri.openBrowser({ url: "https://www.blackskullusa.com.br/institucional/entre-em-contato", inApp: false }),
    },
    {
      icon: termsConditionsIcon,
      name: "home.menuItens.termsConditions.name",
      description: "home.menuItens.termsConditions.description",
      onPress: () => Eitri.openBrowser({ url: "https://www.blackskullusa.com.br/institucional/trocas-e-devolucoes", inApp: false }),
    },
    {
      icon: blogIcon,
      name: "home.menuItens.blog.name",
      description: "home.menuItens.blog.description",
      onPress: () => Eitri.openBrowser({ url: "https://blog.blackskullusa.com.br/", inApp: false }),
    }
  ]

  const [isLoading, setIsLoading] = useState(true);
  const [customerData, setCustomerData] = useState(props.customerData || {});
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const init = async () => {
      await startConfigure();

      setLanguage(i18n);

      const initialInfos = await Eitri.getInitializationInfos();

      if (initialInfos?.action === "RequestLogin") {
        navigate(PAGES.SPLASHSCREEN, { closeAppAfterLogin: true }, true);
        return;
      }

      const isLogged = await isLoggedIn();

      if (!isLogged) {
        navigate(PAGES.SPLASHSCREEN, { redirectTo: "Home" }, true);
        return;
      }

      await loadMe();

      setIsLoading(false);

      sendPageView(PAGE, "account.Home");
    };
    init();
  }, []);

  const loadMe = async () => {
    const customerData = await getCustomerData();
    setCustomerData(customerData);
  };

  const _doLogout = async () => {
    setIsLoading(true);
    await doLogout();
    navigate(PAGES.SPLASHSCREEN, { redirectTo: "Home" }, true);
    setIsLoading(false);
  };

  return (
    <Window bottomInset topInset title={PAGE}>
      <Loading fullScreen isLoading={isLoading} />

      <HeaderContentWrapper borderBottomWidth='hairline'
        borderColor="primary-300">
        <HeaderText
          text={"Olá, seja Bem Vindo(a)"}
        />
        <Touchable onPress={() => navigate(PAGES.SETTINGS)}>
          <Image src={settingsIcon} width={24} height={24} />
        </Touchable>
      </HeaderContentWrapper>

      <View padding="large">
        <View
          direction="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {dataMenu.map((item, index) => (
            <Touchable
              backgroundColor="primary-100"
              borderWidth='hairline'
              borderColor="primary-300"
              display="flex"
              direction="column"
              elevation="low"
              padding="large"
              width="50%"
              height="150px"
              onPress={() => item.onPress()}
              key={index}
            >
              <View marginBottom="medium">
                <Image src={item.icon} width={24} height={24} />
              </View>
              <View marginBottom="small">
                <Text fontWeight="bold" fontSize="medium">
                  {t(item.name)}
                </Text>
              </View>
              <View marginBottom="large">
                <Text fontSize="small">
                  {t(item.description)}
                </Text>
              </View>
            </Touchable>
          ))}
        </View>
      </View>

      <View padding="large" marginTop="display">
        <CustomButton
          label={t("home.labelLeave")}
          icon={iconLogout}
          justifyContent="between"
          paddingHorizontal="large"
          onPress={_doLogout}
        />
      </View>
    </Window>
  );
}

import { useTranslation } from "eitri-i18n";
import { CustomButton, Spacing } from "projeto-ai-shared";
import logoInitial from "../../assets/images/logo-initial.svg";
import { navigate, PAGES } from "../../services/NavigationService";
import { goToSignUpPage } from "../../utils/utils";
import { sendPageView } from "../../services/TrackingService";
import Eitri from 'eitri-bifrost'
import { isLoggedIn } from "../../services/CustomerService";

export default function SplashScreen(props) {
  const redirectTo = props?.location?.state?.redirectTo ?? null;
  const closeAppAfterLogin =
    props?.location?.state?.closeAppAfterLogin ?? false;

  const stateToNavigate = {
    redirectTo,
    closeAppAfterLogin,
  };

  const { t } = useTranslation();

  // STATES OF TRANSITION
  const [transformImg, setTransformImg] = useState("translateY(10vh)");
  const [heightImg, setHeightImg] = useState(243);
  const [widthImg, setWidthImg] = useState(243);
  const [transformBoxCTA, setTransformBoxCTA] = useState("translateY(50vh)");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTransformImg("translateY(-5vh)");
      setHeightImg(202);
      setWidthImg(202);

      setTransformBoxCTA("translateY(8vh)");
    }, 1000);

    sendPageView("SplashScreen", "SplashScreen");

    Eitri.navigation.setOnResumeListener(async () => {
      const isLogged = await isLoggedIn();

      if (isLogged) {
        navigate(PAGES.HOME);
        return;
      }
    })


    return () => clearTimeout(timeout);
  }, []);

  const goToSignInPage = () => {
    navigate(PAGES.SIGNIN, stateToNavigate, true);
  };

  return (
    <Window title="Tela inicial" topInset>
      <View
        display="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100vh"
        paddingHorizontal="large"
      >
        <Image
          src={logoInitial}
          width={widthImg}
          height={heightImg}
          maxWidth="100%"
          maxHeight={"100%"}
          transform={transformImg}
          transition="all 1.5s ease-in-out"
        />

        <Spacing height={207} />

        <View
          width="100%"
          transform={transformBoxCTA}
          transition="all 1.5s ease-in-out"
          marginBottom="large"
        >
          <CustomButton
            width="100%"
            label={"LOGIN"}
            backgroundColor="secondary-500"
            onPress={goToSignInPage}
          />

          <Spacing height={16} />

          <CustomButton
            width="100%"
            label={"Criar conta"}
            backgroundColor="none"
            color="secondary-500"
            variant="outlined"
            borderColor="secondary-500"
            borderWidth="hairline"
            onPress={goToSignUpPage}
          />
        </View>
        <Spacing height={100} />
      </View>
    </Window>
  );
}

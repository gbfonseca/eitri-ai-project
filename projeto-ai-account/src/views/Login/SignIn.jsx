import Eitri from "eitri-bifrost";
import { useTranslation } from "eitri-i18n";
import {
  Alert,
  CustomButton,
  CustomInput,
  HeaderContentWrapper,
  HeaderText,
  Loading,
  Spacing,
} from "projeto-ai-shared";
import IconPassword from "../../assets/icons/new-password-icon-white.svg";
import IconProfile from "../../assets/icons/new-profile-icon-white.svg";
import userIcon from "../../assets/icons/user.svg";
import {
  doLogin,
  getSavedUser,
  loginWithEmailAndKey,
  sendAccessKeyByEmail,
} from "../../services/CustomerService";
import { navigate, PAGES } from "../../services/NavigationService";
import { logEvent, sendPageView } from "../../services/TrackingService";
import {
  goToSignUpPage,
  handleFacebookLogin,
  handleGoogleLogin,
} from "../../utils/utils";

export default function SignIn(props) {
  const redirectTo = props?.location?.state?.redirectTo;
  const closeAppAfterLogin = props?.location?.state?.closeAppAfterLogin;

  const LOGIN_WITH_EMAIL_AND_PASSWORD = "emailAndPassword";
  const LOGIN_WITH_EMAIL_AND_ACCESS_KEY = "emailAndAccessKey";
  const TIME_TO_RESEND_EMAIL = 60;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [loginMode, setLoginMode] = useState(LOGIN_WITH_EMAIL_AND_PASSWORD);

  const [verificationCode, setVerificationCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [timeOutToResentEmail, setTimeOutToResentEmail] = useState(0);

  const [loadingSendingCode, setLoadingSendingCode] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const loadSavedUser = async () => {
      const user = await getSavedUser();
      if (user && user.email) {
        setUsername(user.email);
      }
    };

    loadSavedUser();
    sendPageView("Login", "Signin");
  }, []);

  useEffect(() => {
    if (timeOutToResentEmail > 0) {
      setTimeout(() => {
        setTimeOutToResentEmail((prevState) => prevState - 1);
      }, 1000);
    }
  }, [timeOutToResentEmail]);

  const goToPasswordReset = () => {
    navigate(PAGES.PASSWORD_RESET, { email: username });
  };

  const setLoginMethod = (method) => {
    setLoginMode(method);
  };

  const sendAccessKey = async () => {
    try {
      if (timeOutToResentEmail > 0) {
        return;
      }
      setLoadingSendingCode(true);
      await sendAccessKeyByEmail(username);
      setEmailCodeSent(true);
      setTimeOutToResentEmail(TIME_TO_RESEND_EMAIL);
      setLoadingSendingCode(false);
    } catch (e) {
      console.log("erro ao enviar email", e);
      setAlertMessage(t("signIn.errosSendAccess"));
      setShowLoginErrorAlert(true);
      setEmailCodeSent(false);
      setTimeOutToResentEmail(0);
      setLoadingSendingCode(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await doLogin(username, password);
      logEvent("login", { method: "App" });
      onLoggedIn();
    } catch (e) {
      setAlertMessage("Usuário ou senha inválidos");
      setShowLoginErrorAlert(true);
    }

    setLoading(false);
  };

  const loginWithEmailAndAccessKey = async () => {
    const loggedIn = await loginWithEmailAndKey(username, verificationCode);

    if (loggedIn === "WrongCredentials") {
      setAlertMessage("Token incorreto");
      setShowLoginErrorAlert(true);
    } else if (loggedIn === "Success") {
      logEvent("login", { method: "App" });
      onLoggedIn();
    } else {
      setAlertMessage("Verifique as informaçoes e tente novamente");
      setShowLoginErrorAlert(true);
    }
  };

  const onLoggedIn = () => {
    if (redirectTo) {
      navigate("/" + redirectTo);
    } else if (closeAppAfterLogin) {
      Eitri.close();
    } else {
      Eitri.navigation.back();
    }
  };

  const resendCode = timeOutToResentEmail > 0;

  return (
    <Window title="Login" topInset>
      <Loading isLoading={loading} fullScreen={true} />

      <HeaderContentWrapper
        borderBottomWidth="hairline"
        borderColor="tertiary-900"
      >
        <HeaderText text={`${t("signIn.headerText")}`} />
      </HeaderContentWrapper>

      <View padding="large" paddingTop="display" backgroundColor="primary-500">
        <Text block color="accent-100" fontWeight="bold" fontSize="extra-large">
          {t("signIn.welcome")}
        </Text>

        {loginMode === LOGIN_WITH_EMAIL_AND_PASSWORD && (
          <>
            <View marginTop="display">
              <CustomInput
                icon={IconProfile}
                value={username}
                placeholder={t("signIn.formName")}
                onChange={(value) => setUsername(value)}
                type="email"
                backgroundColor="primary-100"
                borderColor="primary-100"
              />
            </View>

            <View marginTop="large">
              <CustomInput
                placeholder={t("signIn.formPass")}
                icon={IconPassword}
                value={password}
                type="password"
                onChange={(value) => setPassword(value)}
                backgroundColor="primary-100"
                borderColor="primary-100"
              />
            </View>

            {/* FORGOT_PASS */}
            <View
              display="flex"
              alignItems="center"
              justifyContent="start"
              marginTop="large"
            >
              <View display="flex" justifyContent="center">
                <Touchable onPress={goToPasswordReset}>
                  <Text
                    block
                    color="secondary-500"
                    fontSize="nano"
                    textDecoration="underline"
                  >
                    {t("signIn.forgotPass")}
                  </Text>
                </Touchable>
              </View>

              {/* REMOÇÃO APÓS NOVO LAYOUT */}
              {/* <View display="flex" justifyContent="center">
                <Touchable
                  onPress={() => {
                    navigate(PAGES.SIGNUP);
                  }}
                >
                  <Text block color="secondary-500">
                    {t("signIn.noRegister")}
                  </Text>
                </Touchable>
              </View> */}
            </View>

            <View marginTop="display">
              <CustomButton
                width="100%"
                label="LOGIN"
                onPress={handleLogin}
                backgroundColor="secondary-500"
              />
            </View>

            <View direction="column" gap={16} marginVertical="large">
              <CustomButton
                width="100%"
                label="Criar conta"
                color="secondary-500"
                variant="outlined"
                onPress={goToSignUpPage}
              />

              <CustomButton
                width="100%"
                variant="outlined"
                label="LOGIN COM CÓDIGO DE ACESSO"
                color="secondary-500"
                onPress={() => setLoginMethod(LOGIN_WITH_EMAIL_AND_ACCESS_KEY)}
              />
            </View>
          </>
        )}

        {loginMode === LOGIN_WITH_EMAIL_AND_ACCESS_KEY && (
          <View marginTop="display">
            <Text color="accent-100">Receber código de acesso por email</Text>

            <View marginTop="large">
              <CustomInput
                icon={userIcon}
                value={username}
                type="email"
                placeholder={t("signIn.formEmail")}
                onChange={(value) => {
                  setUsername(value);
                }}
                showClearInput={false}
                required={true}
              />
            </View>

            <Touchable
              marginTop="large"
              onPress={() => {
                navigate(PAGES.SIGNUP);
              }}
            >
              <Text block color="secondary-500" textDecoration="underline">
                {t("signIn.noRegister")}
              </Text>
            </Touchable>

            {emailCodeSent && (
              <>
                <View marginTop="large">
                  <CustomInput
                    label={t("signIn.formCodeVerification")}
                    placeholder={t("signIn.formCodeVerification")}
                    inputMode="numeric"
                    value={verificationCode}
                    onChange={(text) => setVerificationCode(text)}
                    height="45px"
                  />
                </View>

                <View marginTop="large">
                  <CustomButton
                    label={t("signIn.labelButton")}
                    disabled={!username || !verificationCode}
                    onPress={loginWithEmailAndAccessKey}
                  />
                </View>
              </>
            )}

            <View marginTop="large">
              <CustomButton
                label={
                  !emailCodeSent
                    ? t("signIn.textSendCode")
                    : `${t("signIn.textResendCode")}${
                        resendCode ? ` (${timeOutToResentEmail})` : ""
                      }`
                }
                disabled={resendCode || !username || loadingSendingCode}
                onPress={sendAccessKey}
              />
            </View>

            <View marginTop="large">
              <CustomButton
                color="secondary-500"
                variant="outlined"
                label={t("signIn.labelLoginWithPass")}
                onPress={() => setLoginMethod(LOGIN_WITH_EMAIL_AND_PASSWORD)}
              />
            </View>
          </View>
        )}

        {Eitri.canIUse("23") && (
          <>
            <View
              marginTop="giant"
              display="flex"
              justifyContent="center"
              marginBottom="giant"
              marginHorizontal="small"
              paddingBottom="large"
              borderBottomWidth="hairline"
              borderColor="tertiary-900"
            >
              <Text color="accent-100" fontWeight="medium">
                Ou
              </Text>
            </View>

            <SocialLogin
              marginTop="extra-large"
              onGoogleLogin={() => handleGoogleLogin(onLoggedIn)}
              onFacebookLogin={() => handleFacebookLogin(onLoggedIn)}
            />
          </>
        )}
      </View>

      <Alert
        type="negative"
        show={showLoginErrorAlert}
        onDismiss={() => setShowLoginErrorAlert(false)}
        duration={7}
        message={alertMessage}
      />
    </Window>
  );
}

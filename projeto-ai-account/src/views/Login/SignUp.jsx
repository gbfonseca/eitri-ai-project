import Eitri from "eitri-bifrost";
import {
  Alert,
  CustomButton,
  CustomInput,
  Spacing,
} from "projeto-ai-shared";
import lockIcon from "../../assets/icons/new-password-icon-white.svg";
import userIcon from "../../assets/icons/new-profile-icon-white.svg";
import BigTitle from "../../components/BigTitle/BigTitle";
import CCheckbox from "../../components/CCheckbox/CCheckbox";
import {
  sendAccessKeyByEmail,
  sendPassword,
} from "../../services/CustomerService";
import { navigate } from "../../services/NavigationService";
import { logError, sendPageView } from "../../services/TrackingService";
import { handleFacebookLogin, handleGoogleLogin } from "../../utils/utils";

export default function SignUp(props) {
  const PAGE = "Cadastro";
  const redirectTo = props?.location?.state?.redirectTo;
  const closeAppAfterLogin = props?.location?.state?.closeAppAfterLogin;

  const TIME_TO_RESEND_EMAIL = 60;

  const [checked, setChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorValidPassord, setErrorValidPassord] = useState([]);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorUserName, setErrorUserName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [timeOutToResentEmail, setTimeOutToResentEmail] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [loadingSendingCode, setLoadingSendingCode] = useState(false);

  useEffect(() => {
    sendPageView(PAGE, 'SignUp');
  }, []);

  useEffect(() => {
    if (timeOutToResentEmail > 0) {
      setTimeout(() => {
        setTimeOutToResentEmail((prevState) => prevState - 1);
      }, 1000);
    }
  }, [timeOutToResentEmail]);

  const sendAccessKey = async () => {
    setShowLoginErrorAlert(false);
    setErrorConfirmPassword("");
    setErrorUserName("");

    if (!username) {
      setErrorUserName("Digite um e-mail válido");
      return;
    }

    if (password.length < 8 || errorValidPassord.length > 0) {
      setErrorConfirmPassword("Digite uma senha de 8 digitos");
      return;
    }
    if (password !== confirmPassword) {
      setErrorConfirmPassword(
        "As senhas não coincidem. Por favor, verifique e tente novamente."
      );
      return;
    }

    if (!checked) {
      setAlertMessage("É necessário aceitar os termos da Toymania");
      setShowLoginErrorAlert(true);
      return;
    }

    try {
      if (timeOutToResentEmail > 0) {
        return;
      }

      await sendAccessKeyByEmail(username);
      setEmailCodeSent(true);
      setLoadingSendingCode(true);
      setTimeOutToResentEmail(TIME_TO_RESEND_EMAIL);
      setLoadingSendingCode(false);
    } catch (error) {
      logError(PAGE, "erro ao enviar email", error);
      setAlertMessage("Erro ao enviar email");
      setShowLoginErrorAlert(true);
      setEmailCodeSent(false);
      setTimeOutToResentEmail(0);
      setLoadingSendingCode(false);
    }
  };

  const resendAccesKey = async () => {
    try {
      await sendAccessKeyByEmail(username);
      setEmailCodeSent(true);
      setLoadingSendingCode(true);
      setTimeOutToResentEmail(TIME_TO_RESEND_EMAIL);
      setLoadingSendingCode(false);
    } catch (error) {
      logError(PAGE, "erro ao reenviar email", error);
      setAlertMessage("Erro ao enviar email");
      setShowLoginErrorAlert(true);
      setTimeOutToResentEmail(0);
      setLoadingSendingCode(false);
    }
  };

  const loginWithEmailAndAccessKey = async () => {
    try {
      await sendPassword(username, verificationCode, password);
      logEvent('sign_up', {method: 'App'});
      if (redirectTo) {
        navigate(redirectTo);
      } else if (closeAppAfterLogin) {
        Eitri.close();
      } else {
        navigate("Home");
      }
    } catch (error) {
      logError(PAGE, "loginWithEmailAndAccessKey", error);
      if (error?.response?.data?.authStatus === "WrongCredentials") {
        setAlertMessage("Código de acesso incorreto");
        setShowLoginErrorAlert(true);
      } else {
        setAlertMessage("Verifique as informaçoes e tente novamente");
        setShowLoginErrorAlert(true);
      }
    }
  };

  const validatePassword = (value) => {
    setPassword(value);
    let errors = [];

    if (!/[A-Z]/.test(password)) {
      errors.push("ABC - 1 letra maiúscula.");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("abc - 1 letra minúscula.");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("123 - 1 número.");
    }

    if (password.length < 7) {
      errors.push("*** - No mínimo 8 caracteres.");
    }

    if (errors.length > 0) {
      setErrorValidPassord(errors);
    } else {
      setErrorValidPassord([]);
    }
  };

  const resendCode = timeOutToResentEmail > 0;

  return (
    <Window topInset bottomInset>
      <BigTitle title="Criar uma conta" withBackAction />

      <View padding="large">
        {emailCodeSent ? (
          <>
            <Spacing height={"30px"} />

            <View display="flex" justifyContent="center">
              <Text textAlign="center">
                Digite abaixo o código recebido por email
              </Text>
            </View>

            <View marginTop="large">
              <CustomInput
                inputMode="numeric"
                value={username}
                disabled
                height="45px"
                color="neutral-300"
              />
            </View>

            <View marginTop="large">
              <CustomInput
                label={"Código de verificação"}
                placeholder="Código de verificação"
                inputMode="numeric"
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
                height="45px"
              />
            </View>

            <View marginTop="large">
              <CustomButton
                backgroundColor={
                  !username || !verificationCode
                    ? "neutral-300"
                    : "secondary-300"
                }
                borderColor={
                  !username || !verificationCode
                    ? "neutral-300"
                    : "secondary-300"
                }
                color={!username || !verificationCode ? "accent-100" : ""}
                label="Login"
                onPress={loginWithEmailAndAccessKey}
                disabled={!username || !verificationCode}
              />
            </View>

            <View marginTop="large">
              <CustomButton
                backgroundColor={
                  !resendCode || !username || loadingSendingCode
                    ? "secondary-300"
                    : "neutral-300"
                }
                borderColor={
                  !resendCode || !username || loadingSendingCode
                    ? "secondary-300"
                    : "neutral-300"
                }
                color={
                  emailCodeSent && resendCode ? "neutral-500" : "accent-100"
                }
                label={
                  !emailCodeSent
                    ? `Enviar código`
                    : `Reenviar código${
                        resendCode ? ` (${timeOutToResentEmail})` : ""
                      }`
                }
                disabled={resendCode || !username || loadingSendingCode}
                onPress={resendAccesKey}
              />
            </View>
          </>
        ) : (
          <>
            <View marginTop="nano">
              <CustomInput
                type="email"
                icon={userIcon}
                placeholder="Nome de usuário ou e-mail"
                value={username}
                onChange={(value) => setUsername(value)}
              />

              {errorUserName && (
                <>
                  <Spacing height={"10px"} />

                  <Text color="tertiary-500">{errorUserName}</Text>
                </>
              )}
            </View>

            <View marginTop="large">
              <CustomInput
                placeholder="Senha"
                icon={lockIcon}
                type="password"
                value={password}
                onChange={(value) => validatePassword(value)}
              />

              {errorValidPassord.length > 0 && (
                <>
                  <Spacing height={"10px"} />

                  {errorValidPassord.map((error, idx) => (
                    <View key={idx}>
                      <Text color="tertiary-500">{error}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>

            <View marginTop="large">
              <CustomInput
                placeholder="Confirme a senha"
                icon={lockIcon}
                type="password"
                value={confirmPassword}
                onChange={(value) => setConfirmPassword(value)}
              />

              {errorConfirmPassword && (
                <>
                  <Spacing height={"10px"} />

                  <Text color="tertiary-500">{errorConfirmPassword}</Text>
                </>
              )}
            </View>

            <View marginTop="large">
              <CCheckbox
                checked={checked}
                renderMode="default"
                isCheckboxRegister
                onChange={() => setChecked(!checked)}
              />
            </View>

            <View marginTop="display">
              <CustomButton
                backgroundColor="secondary-500"
                label="Registrar"
                onPress={sendAccessKey}
              />
            </View>
          </>
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
              onGoogleLogin={handleGoogleLogin}
              onFacebookLogin={handleFacebookLogin}
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

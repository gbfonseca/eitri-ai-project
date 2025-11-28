import { useTranslation } from "eitri-i18n";
import {
  Alert,
  CustomButton,
  CustomInput,
  Loading,
} from "projeto-ai-shared";
import mailIcon from "../../assets/icons/mail.svg";
import BigTitle from "../../components/BigTitle/BigTitle";
import { sendPasswordResetCode } from "../../services/CustomerService";
import { navigate, PAGES } from "../../services/NavigationService";
import { sendPageView } from "../../services/TrackingService";

export default function PasswordReset(props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const email = props?.location?.state?.email;
    if (email) {
      setUsername(email);
    }
    sendPageView('Resetar senha', 'PasswordReset');
  }, []);

  const goToPasswordResetCode = async () => {
    try {
      if (!username) {
        return;
      }

      setLoading(true);
      await sendPasswordResetCode(username);
      navigate(PAGES.PASSWORD_RESET_CODE, { email: username });
      setLoading(false);
    } catch (e) {
      setShowErrorAlert(true);
      setLoading(false);
    }
  };

  return (
    <Window topInset>
      <Loading isLoading={loading} fullScreen={true} />
      <BigTitle title={t("passwordReset.forgotPassTitle")} withBackAction />

      <View padding="large">
        <View marginTop="nano">
          <CustomInput
            icon={mailIcon}
            placeholder={t("passwordReset.setEmail")}
            value={username}
            onChange={setUsername}
            type="email"
          />
        </View>

        <View marginTop="large">
          <Text color="secondary-500" fontSize="nano" marginRight="quark">
            *
          </Text>
          <Text color="accent-100" fontSize="nano">
            {t("passwordReset.messageRecovery")}
          </Text>
        </View>

        <View marginTop="display">
          <CustomButton
            width="100%"
            label={t("passwordReset.sendButton")}
            onPress={goToPasswordResetCode}
          />
        </View>
      </View>

      <Alert
        type="negative"
        show={showErrorAlert}
        onDismiss={() => setShowErrorAlert(false)}
        duration={7}
        message={t("passwordReset.messageError")}
      />
    </Window>
  );
}

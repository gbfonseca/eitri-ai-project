import { useTranslation } from "eitri-i18n";
import { CustomButton } from "projeto-ai-shared";
import BigTitle from "../../components/BigTitle/BigTitle";
import { navigate, PAGES } from "../../services/NavigationService";
import { sendPageView } from "../../services/TrackingService";

export default function PasswordResetCode(props) {
  const [recoveryCode, setRecoveryCode] = useState("");

  const RECOVERY_CODE_LENGTH = 4;

  const email = props?.location?.state?.email;

  const { t } = useTranslation();

  useEffect(() => {
    sendPageView('Codigo Resetar Senha', 'PasswordResetCode');
  }, []);

  const goToPasswordNewPass = () => {
    if (recoveryCode.length !== RECOVERY_CODE_LENGTH) {
      return;
    }

    navigate(PAGES.PASSWORD_RESET_NEW_PASS, { email: email, recoveryCode });
  };

  const onCodeFilled = (value) => {
    setRecoveryCode(value);
  };

  return (
    <Window topInset>
      <BigTitle title={t("passwordReset.forgotPassTitle")} withBackAction />

      <View padding="large">
        <Text color="accent-100" fontSize="small" marginTop="nano">
          {t("passwordResetCode.messageEmail")}

          <Text
            color="accent-100"
            fontSize="small"
            marginLeft="quark"
            fontWeight="bold"
          >
            {email}
          </Text>
        </Text>

        <View
          marginTop="large"
          display="flex"
          justifyContent="center"
        >
          <View
            width="240px"
          >
            <CodeInput
              autoSubmit
              maxLength={4}
              onChange={onCodeFilled}
              accept="numbers"
            />
          </View>
        </View>

        <View marginTop="display">
          <CustomButton
            backgroundColor="secondary-500"
            color="accent-100"
            disabled={recoveryCode.length !== RECOVERY_CODE_LENGTH}
            label={t("passwordResetCode.sendButton")}
            onPress={goToPasswordNewPass}
          />
        </View>
      </View>
    </Window>
  );
}

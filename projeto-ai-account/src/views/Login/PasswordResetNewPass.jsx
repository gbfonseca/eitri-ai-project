import { useTranslation } from "eitri-i18n";
import {
  Alert,
  CustomButton,
  CustomInput,
  Loading,
} from "projeto-ai-shared";
import lockIcon from "../../assets/icons/new-password-icon-white.svg";
import BigTitle from "../../components/BigTitle/BigTitle";
import { setPassword } from "../../services/CustomerService";
import { navigate } from "../../services/NavigationService";
import { sendPageView } from "../../services/TrackingService";
import dotIcon from "../../assets/icons/dot-icon.svg";
import InfoChangePasswordModal from '../../components/InfoChangePassword/InfoChangePasswordModal';

export default function PasswordResetNewPass(props) {
  const email = props?.location?.state?.email;
  const recoveryCode = props?.location?.state?.recoveryCode;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showInfoChangePasswordModal, setShowInfoChangePasswordModal] = useState(false);
  const { t } = useTranslation();

  const requirements = [
    {
      text: t("passwordResetNewPass.passwordRequirementsCharacters"),
      valid: newPassword.length >= 8,
    },
    {
      text: t("passwordResetNewPass.passwordRequirementsNumber"),
      valid: /[0-9]/.test(newPassword),
    },
    {
      text: t("passwordResetNewPass.passwordRequirementsUppercase"),
      valid: /[A-Z]/.test(newPassword),
    },
    {
      text: t("passwordResetNewPass.passwordRequirementsLowercase"),
      valid: /[a-z]/.test(newPassword),
    },
    {
      text: t("passwordResetNewPass.passwordRequirementsCoincide"),
      valid: newPassword === confirmPassword,
    },
  ];

  useEffect(() => {
    sendPageView('Nova senha', 'PasswordResetNewPass');
  }, []);

  const confirmNewPassword = async () => {
    try {
      if (!email || !recoveryCode || !newPassword) {
        return;
      }
      setLoading(true);
      await setPassword(email, recoveryCode, newPassword);
      setLoading(false);
      setShowInfoChangePasswordModal(true);
    } catch (e) {
      setShowErrorAlert(true);
      setLoading(false);
    }
  };

  const handleOpenHome = () => {
    navigate("Home");
    setShowInfoChangePasswordModal(false);
  };

  const allRequirementsMet = requirements.every((req) => req.valid);
  const passwordsMatch = newPassword === confirmPassword;

  return (
    <Window topInset>
      <Loading isLoading={loading} fullScreen={true} />
      <BigTitle title={t("passwordReset.forgotPassTitle")} withBackAction />

      <View padding="large">
        <View
          marginTop="nano"
          marginBottom="small"
        >
          <Text
            color="accent-100"
            fontSize="medium"
          >
            {t("passwordResetNewPass.descriptionRecoveryCode")}
          </Text>
        </View>

        <View marginTop="nano">
          <CustomInput
            autoFocus
            icon={lockIcon}
            type="password"
            placeholder={t("passwordResetNewPass.newPass")}
            value={newPassword}
            onChange={setNewPassword}
          />
        </View>

        <View marginTop="large">
          <CustomInput
            icon={lockIcon}
            type="password"
            placeholder={t("passwordResetNewPass.confirmPass")}
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </View>

        {newPassword.length > 0 ? (
          <View marginTop="display">
            <Text fontWeight="bold" color="neutral-300">
              {t("passwordResetNewPass.passwordRequirements")}
            </Text>

            <View marginTop="quark">
              {requirements.map((req, index) => (
                <View key={req.text} display="flex" alignItems="center" gap={6}>
                  <Icon
                    color={req.valid ? "positive-700" : "negative-700"}
                    width={16}
                    height={16}
                    iconKey={req.valid ? "check" : "x"}
                  />

                  <Text
                    key={index}
                    color={req.valid ? "positive-700" : "negative-700"}
                  >
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View marginTop="display">
            <Text fontWeight="bold" color="neutral-300">
              {t("passwordResetNewPass.passwordRequirements")}
            </Text>

            <View marginTop="quark">
              {requirements.map((req, index) => (
                <View key={req.text} display="flex" alignItems="center" gap={6}>
                  <Image
                    src={dotIcon}
                    width={16}
                    height={16}
                  />
                  <Text
                    key={index}
                  >
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View marginTop="large">
          <CustomButton
            width="100%"
            disabled={!allRequirementsMet}
            label={t("passwordResetNewPass.sendButton")}
            onPress={confirmNewPassword}
          />
        </View>
      </View>

      <Alert
        type="negative"
        show={showErrorAlert}
        onDismiss={() => setShowErrorAlert(false)}
        duration={7}
        message={t("passwordResetNewPass.messageError")}
      />

      <InfoChangePasswordModal
        onPress={handleOpenHome}
        showModal={showInfoChangePasswordModal}
        onClose={() => setShowInfoChangePasswordModal(false)}
      />
    </Window>
  );
}

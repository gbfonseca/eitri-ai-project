import iconFacebook from "../../assets/images/social_facebook.svg";
import iconApple from "../../assets/images/social_apple.svg";
import iconGoogle from "../../assets/images/social_google.svg";

export default function SocialLogin(props) {
  const { onGoogleLogin, onFacebookLogin } = props;

  return (
    <View direction="column" gap={8} {...props}>
      {/* <Touchable
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={8}
        backgroundColor="accent-100"
        borderRadius="small"
        height="48px"
        padding="small"
      >
        <Image src={iconApple} width="24px" height="24px" />

        <Text
          block
          color="primary-500"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Continuar com a Apple
        </Text>
      </Touchable> */}

      <Touchable
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={8}
        customColor="#3D5A98"
        borderRadius="small"
        height="48px"
        padding="small"
        onPress={onFacebookLogin}
      >
        <Image src={iconFacebook} width="24px" height="24px" />

        <Text
          block
          color="background-color"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Continuar com Facebook
        </Text>
      </Touchable>

      <Touchable
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={8}
        height="48px"
        backgroundColor="accent-100"
        borderRadius="small"
        onPress={onGoogleLogin}
      >
        <Image src={iconGoogle} width="24px" height="24px" />

        <Text color="accent-300" fontWeight="bold" textTransform="uppercase">
          Continuar com o Google
        </Text>
      </Touchable>
    </View>
  );
}

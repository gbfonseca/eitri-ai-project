import eyeOn from "../../assets/images/eye-on.svg";
import eyeOff from "../../assets/images/eye-off.svg";
import IconProfile from "../../assets/icons/new-profile-icon-white.svg";
import IconPassword from "../../assets/icons/new-password-icon-white.svg";
import IconMaskPass from "../../assets/icons/new-maskpass-icon-white.svg";
import IconShowPass from "../../assets/icons/new-showpass-icon-white.svg";

export default function CustomInput(props) {
  const {
    color,
    icon,
    type,
    backgroundColor,
    borderColor,
    mask,
    width,
    label,
    height,
    borderWidth,
    maxHeight,
    paddingHorizontal,
    ...rest
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View width={width || "100%"}>
      {label && (
        <View marginBottom="nano">
          <Text
            color={color || "accent-100"}
            fontSize="extra-small"
            fontWeight={"bold"}
          >
            {label}
          </Text>
        </View>
      )}

      <View
        height={height || "48px"}
        display="flex"
        alignItems="center"
        color="accent-500"
        backgroundColor={backgroundColor || "primary-100"}
        borderColor={borderColor || "primary-100"}
        paddingHorizontal={paddingHorizontal || "large"}
        width="100%"
        borderRadius="small"
        borderWidth={borderWidth || ""}
        maxHeight={maxHeight || ""}
      >
        {icon && (
          <View minWidth={24}>
            <Image src={icon} alt="Ícone" />
          </View>
        )}

        {mask ? (
          <MaskedInput
            borderHidden={true}
            mask={mask}
            width="100%"
            color={color || "primary-500"}
            {...rest} />
        ) : (
          <Input
            color={color || "primary-500"}
            borderHidden={true}
            type={showPassword ? "text" : type || "text"}
            width="100%"
            {...rest}
          />
        )}

        {type === "password" && (
          <Touchable onPress={() => setShowPassword(!showPassword)}>
            <Image src={showPassword ? IconShowPass : IconMaskPass} />
          </Touchable>
        )}
      </View>
    </View>
  );
}

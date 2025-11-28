import Loading from "../Loading/Loading";

export default function CustomButton(props) {
  const {
    disabled,
    color,
    backgroundColor,
    variant,
    label,
    onPress,
    isLoading,
    width,
    borderRadius,
    borderColor,
    icon,
    justifyContent = "center",
    alignItems = "center",
    loadingHeight = "",
    loadingWidth = "",
    height = "48px",
    ...rest
  } = props;

  const _onPress = () => {
    if (!disabled && onPress && typeof onPress === "function") {
      onPress();
    }
  };

  const _backgroundColor = (() => {
    if (variant === "outlined") {
      return "transparent";
    }
    return isLoading || disabled
      ? "neutral-300"
      : backgroundColor || "secondary-500";
  })();

  const _borderColor = (() => {
    return isLoading || disabled
      ? "neutral-300"
      : borderColor || "secondary-500";
  })();

  const _color = (() => {
    return isLoading || disabled ? "neutral-900" : color || "accent-100";
  })();

  return (
    <Touchable
      onPress={_onPress}
      display="flex"
      height={height || "48px"}
      width={width || "100%"}
      maxWidth="100%"
      backgroundColor={_backgroundColor}
      justifyContent={justifyContent}
      alignItems={alignItems}
      borderRadius={borderRadius || "small"}
      borderWidth={variant === "outlined" ? "hairline" : ""}
      borderColor={_borderColor}
      {...rest}
    >
      {isLoading ? (
        <Loading height={loadingHeight} width={loadingWidth} />
      ) : (

        <>
          <Text fontWeight="bold" color={_color} textTransform="uppercase">
            {label}
          </Text>

          {icon && (
            <View minWidth={24}>
              <Image src={icon} alt="Ícone" />
            </View>
          )}
        </>
      )}
    </Touchable>
  );
}

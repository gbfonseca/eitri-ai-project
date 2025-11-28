export default function ProductCardContentWrapper(props) {
  const { children, width, onPressOnCard, ...rest } = props;

  return (
    <View
      position="relative"
      backgroundColor={"accent-100"}
      minWidth={width || "auto"}
      maxWidth={width || "auto"}
      borderRadius="small"
      // elevation='low'
      {...rest}
    >
      {children}

      <Touchable
        onPress={onPressOnCard}
        position="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
      />
    </View>
  );
}

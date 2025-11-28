export default function HeaderMenu(props) {
  const { iconColor, content, showDrawer, onCloseDrawer, onPressOpenButton } =
    props;

  const [initialTransparency, setInitialTransparency] = useState("transparent");

  // Pra tratar o flicker do drawer
  useEffect(() => {
    setTimeout(() => {
      setInitialTransparency("solid");
    }, 2000);
  }, []);

  return (
    <>
      <Touchable onPress={onPressOpenButton}>
        <Icon
          width={24}
          height={24}
          color={iconColor || "accent-100"}
          iconKey="menu"
        />
      </Touchable>

      <>
        {showDrawer && (
          <Touchable
            onPress={onCloseDrawer}
            position="fixed"
            customColor="#000000"
            top="0px"
            left="0px"
            bottom="0px"
            opacity="half"
            zIndex="998"
            right="0px"
          />
        )}

        <View
          id={"drawer-content"}
          position="absolute"
          top={0}
          width="100vw"
          height="100vh"
          maxHeight="100vh"
          backgroundColor="primary-500"
          borderRadiusRightTop="medium"
          borderRadiusRightBottom="medium"
          zIndex="999"
          opacity={initialTransparency}
          left={showDrawer ? "0" : "-100vw"}
        >
          <View
            paddingBottom="display"
            paddingHorizontal="large"
            height="100%"
            width="100%"
            display="flex"
            direction="column"
          >
            <View topInset />
            {content}
            <View bottomInset />
          </View>
        </View>
      </>
    </>
  );
}

export default function CollapsableDrawer(props) {
  const {
    children,
    title,
    willStartCollapsed,
    subCategory,
    imageUrl,
    isCollapsed: externalIsCollapsed,
    onToggle,
  } = props;

  const [internalCollapsed, setInternalCollapsed] = useState(
    externalIsCollapsed ?? willStartCollapsed
  );

  useEffect(() => {
    if (externalIsCollapsed !== undefined) {
      setInternalCollapsed(externalIsCollapsed);
    }
  }, [externalIsCollapsed]);

  const toggleCollapsedState = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const isCollapsed =
    externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;

  return (
    <View
      borderBottomWidth={subCategory ? "none" : "hairline"}
      borderColor="primary-300"
      width="100%"
    >
      <Touchable
        display="flex"
        direction="row"
        justifyContent="between"
        alignItems="center"
        onPress={toggleCollapsedState}
        height={subCategory ? "auto" : 48}
      >
        <View display="flex" alignItems="center" gap={16}>
          <Image src={imageUrl} width={16} />

          <Text
            fontWeight={subCategory ? "normal" : "bold"}
            fontSize={subCategory ? "extra-small" : "small"}
            textTransform="uppercase"
          >
            {title}
          </Text>
        </View>

        <Icon
          iconKey={
            subCategory
              ? isCollapsed
                ? "chevron-right"
                : "chevron-down"
              : isCollapsed
              ? "plus"
              : "minus"
          }
          width={16}
          height={16}
          color="secondary-300"
        />
      </Touchable>

      {!isCollapsed && <>{children}</>}
    </View>
  );
}

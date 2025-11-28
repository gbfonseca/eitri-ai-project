export default function HeaderSearchIcon(props) {
  const { navigateToSearch, onPress, marginTop, marginBottom } = props;

  return (
    <Touchable
      display="flex"
      alignItems="center"
      justifyContent="between"
      backgroundColor="accent-700"
      height="40px"
      width="100%"
      borderRadius="small"
      paddingHorizontal="large"
      marginTop={marginTop ? marginTop : "large"}
      marginBottom={marginBottom ? marginBottom : "extra-large"}
      onPress={onPress || navigateToSearch}
    >
      <Text color="accent-100">Procurar...</Text>

      <Icon color="secondary-500" iconKey="search" width={24} height={24} />
    </Touchable>
  );
}

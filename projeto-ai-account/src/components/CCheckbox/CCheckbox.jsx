export default function CCheckbox(props) {
  const {
    checked,
    onChange,
    label,
    renderMode,
    align,
    justify,
    isCheckboxRegister,
  } = props;

  return (
    <View
      display="flex"
      direction="row"
      alignItems={align || "top"}
      justifyItems={justify || "left"}
    >
      <Checkbox
        renderMode={renderMode || "default"}
        checked={checked}
        onChange={() => onChange(!checked)}
      />

      {isCheckboxRegister && (
        <Touchable
          onPress={() => onChange(!checked)}
          marginLeft="nano"
          alignItems="center"
        >
          <Text color="accent-100" fontSize="nano">
            Ao clicar
          </Text>

          <Text
            color="secondary-500"
            fontWeight="bold"
            paddingLeft="quark"
            paddingRight="quark"
            fontSize="nano"
          >
            Registrar
          </Text>

          <Text color="accent-100" fontSize="nano">
            você concorda com os termos de serviço da
          </Text>

          <Text
            color="accent-100"
            fontWeight="bold"
            paddingLeft="quark"
            fontSize="nano"
          >
            Black Skull.
          </Text>
        </Touchable>
      )}

      {label && !isCheckboxRegister && (
        <Touchable onPress={() => onChange(!checked)} marginLeft="nano">
          <Text color="accent-100" block paddinLeft="small" fontSize="nano">
            {label}
          </Text>
        </Touchable>
      )}
    </View>
  );
}

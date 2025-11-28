import arrowLeft from "../../assets/icons/arrow-left.svg";
import Eitri from "eitri-bifrost";

export default function BigTitle(props) {
  const { title, withBackAction } = props;

  const goBack = () => {
    Eitri.navigation.back();
  };

  return (
    <View
      display="flex"
      alignItems="center"
      borderBottomWidth="hairline"
      borderColor="tertiary-900"
      padding="large"
    >
      {withBackAction && (
        <View
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginRight="display"
        >
          <Touchable onPress={goBack}>
            <Image src={arrowLeft} width="24px" height="24px" />
          </Touchable>
        </View>
      )}

      <Text
        color="accent-100"
        block
        fontWeight="bold"
        fontFamily="Barlow"
        fontSize="extra-large"
      >
        {title}
      </Text>
    </View>
  );
}

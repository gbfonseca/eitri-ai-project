import { View } from "eitri-luminus";
import { Spacing } from "projeto-ai-shared";
export default function NutritionalTable(props) {
  const { imgTable } = props;

  return (
    <View backgroundColor="primary-100">
      <View display="flex" justifyContent="center">
        <Text fontSize="large" fontWeight="bold">
          TABELA NUTRICIONAL
        </Text>
      </View>
      <Spacing height="24px" />
      <View backgroundColor="primary-100">
        <Image width="100%" height="100%" src={imgTable.imageUrl} />
      </View>
    </View>
  );
}

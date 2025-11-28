import Description from "./Description";
import Information from "./Information";
import ConsumptionMethod from "./ConsumptionMethod";
import NutritionalTable from "./NutritionalTable";
import { Text, View } from "eitri-luminus";
import Ingredient from "./Ingredient";

export default function DescriptionComponent(props) {
  const { product, currentSku, ...rest } = props;

  const buildIngredients = (product) => {
    let result = {};

    // const isExcluded = (name) =>
    //   ["Conteudo Enriquecido", "Modo de Consumo"].includes(name);

    if (product?.allSpecifications) {
      product?.allSpecifications?.forEach((element) => {
        if (element === "ingredientes") {
          result[element] = product[element];
        }
      });
    } else {
      // Quando o produto vem através do intelligenceSearch a forma de pegar as especificações são diferente
      let allSpecifications = product?.specificationGroups?.find(
        (group) => group.originalName === "allSpecifications"
      );
      allSpecifications?.specifications.forEach((element) => {
        if (element.name === "ingredientes") {
          result[element.name] = element.values;
        }
      });
    }
    return [result[0] || result["ingredientes"]];
  };

  const getConsumptionMethod = (product) => {
    let result = {};
    console.log("product dentro do getConsumptionMethod", product);
    if (product?.allSpecifications) {
      product?.allSpecifications?.forEach((element) => {
        if (element === "Modo de Consumo") {
          result[element] = product[element];
        }
      });
    } else {
      let allSpecifications = product?.specificationGroups?.find(
        (group) => group.originalName === "allSpecifications"
      );
      allSpecifications?.specifications.forEach((element) => {
        if (element.name === "Modo de Consumo") {
          result[element.name] = element.values;
        }
      });
    }

    return [result];
  };

  // const especifications = buildSpecifications(product);
  // console.log("especifications", especifications);

  const ingredients = buildIngredients(product);
  const consumptionMethod = getConsumptionMethod(product);
  const imgTable = currentSku?.images?.find((item) =>
    item?.imageLabel?.toLowerCase()?.includes("tabela")
  );

  // console.log("imgTable", imgTable);

  return (
    <View {...rest}>
      <View
        paddingVertical="display"
        marginTop="medium"
        justifyContent="center"
        alignItems="center"
        width="100%"
        display="flex"
        alignContent="center"
      >
        <Text fontSize="display" fontWeight="bold" textAlign="center">
          SUGESTÕES DE USO
        </Text>
      </View>

      {product?.description && (
        <View
          backgroundColor="primary-100"
          paddingHorizontal="large"
          paddingVertical="display"
          marginHorizontal="medium"
          marginTop="medium"
          borderRadius="micro"
        >
          <Description description={product?.description} />
        </View>
      )}
      {consumptionMethod && (
        <View
          backgroundColor="primary-100"
          paddingHorizontal="large"
          paddingVertical="display"
          marginHorizontal="medium"
          marginTop="medium"
          borderRadius="micro"
        >
          <ConsumptionMethod specifications={consumptionMethod} />
        </View>
      )}
      {ingredients && (
        <View
          backgroundColor="primary-100"
          paddingHorizontal="large"
          paddingVertical="display"
          marginHorizontal="medium"
          marginTop="medium"
          borderRadius="micro"
        >
          <Ingredient ingredients={ingredients} />
        </View>
      )}
      {/* {especifications && (
        <View
          backgroundColor="primary-100"
          paddingHorizontal="large"
          paddingVertical="display"
          marginHorizontal="medium"
          marginTop="medium"
          borderRadius="micro"
        >
          <Information specifications={especifications} />
        </View>
      )} */}
      {imgTable && (
        <View
          backgroundColor="primary-100"
          paddingHorizontal="large"
          paddingVertical="display"
          marginHorizontal="medium"
          marginTop="medium"
          borderRadius="micro"
        >
          <NutritionalTable imgTable={imgTable} />
        </View>
      )}
    </View>
  );
}

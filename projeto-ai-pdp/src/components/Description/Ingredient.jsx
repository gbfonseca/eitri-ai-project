import { useTranslation } from "eitri-i18n";
import { View } from "eitri-luminus";
import { Divisor, Spacing } from "projeto-ai-shared";
import { useState } from "react";

export default function Ingredient(props) {
  const { ingredients } = props;

  const [collapsed, setCollapsed] = useState(false)

  const { t } = useTranslation()

  const toggleCollapsedState = () => {
    setCollapsed(!collapsed)
  }

  return (
    <View>
      {ingredients && (
        <View direction="column">
          <Touchable onPress={() => toggleCollapsedState()}>
            <View
              display="flex"
              alignItems="center"
              justifyContent="between"
              width="100%"
            >
              <Text color="accent-100" fontSize="large" fontWeight="bold">
                {t("ingredients.txtIngredients")}
              </Text>
              <Icon
                color="secondary-500"
                iconKey={collapsed ? "minus" : "plus"}
                width={26}
              />
            </View>
          </Touchable>
          {collapsed && (
            <View>
              <Divisor backgroundColor="accent-900" />
              <Spacing height="16px" />
              {ingredients.map((ingredient, index) => (
                <View key={index}>
                  <Text color="accent-100" fontSize="medium" whiteSpace="pre-wrap">
                    {ingredient}
                  </Text>
                </View>
              ))}
              <Spacing height="20px" />
            </View>
          )}
        </View>
      )}
    </View>
  );

}
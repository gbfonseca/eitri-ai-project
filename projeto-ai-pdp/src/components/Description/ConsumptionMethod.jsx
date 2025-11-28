import { Spacing, Divisor } from "projeto-ai-shared";
import { useTranslation } from "eitri-i18n";
import { View } from "eitri-luminus";

export default function ConsumptionMethod(props) {
  const { specifications } = props;

  const [collapsed, setCollapsed] = useState(false);

  const { t } = useTranslation();

  const toggleCollapsedState = () => {
    setCollapsed(!collapsed);
  };

  // console.log("specifications", specifications);

  return (
    <View>
      {specifications && (
        <View direction="column">
          <Touchable onPress={() => toggleCollapsedState()}>
            <View
              display="flex"
              alignItems="center"
              justifyContent="between"
              width="100%"
            >
              {specifications.map((specification, index) => (
                <View key={index} marginBottom="nano">
                  {Object.entries(specification).map(([key, value]) => (
                    <Text
                      key={key}
                      color="accent-100"
                      fontSize="large"
                      fontWeight="bold"
                    >{`${key} `}</Text>
                  ))}
                </View>
              ))}
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
              {specifications.map((specification, index) => (
                <View key={index}>
                  {Object.entries(specification).map(([key, value]) => (
                    <View key={key} marginBottom="nano">
                      {value.length > 1 ? (
                        <View marginTop="quark">
                          {value.map((item, index) => (
                            <View key={index} display="flex" direction="column">
                              <Text
                                color="accent-100"
                                marginRight="nano"
                                fontSize="medium"
                                textAlign="justify"
                              >
                                {item}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text color="accent-100" fontSize="medium">{value}</Text>
                      )}
                    </View>
                  ))}
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

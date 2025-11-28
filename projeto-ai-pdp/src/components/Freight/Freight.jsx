import Eitri from "eitri-bifrost";
import { CustomButton, CustomInput } from "projeto-ai-shared";
import { useTranslation } from "eitri-i18n";

import fetchFreight from "../../services/freightService";
import { getCmsContent } from "../../services/cmsService";

export default function Freight(props) {
  const { currentSku } = props;

  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [freightOptions, setFreightOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cmsPDP, setCmsPDP] = useState([]);

  const loadCmsPDP = async () => {
    try {
      const result = await getCmsContent("pdp", "pdp");
      setCmsPDP(result?.sections || []);
    } catch (error) {
      console.error("Error loading CMS PDP", error);
    }
  };

  useEffect(() => {
    handleZipCode();
    loadCmsPDP();
  }, []);

  const handleZipCode = async () => {
    const postalCodeStorage = await Eitri.sharedStorage.getItem("zipCode");
    if (postalCodeStorage) {
      setZipCode(postalCodeStorage);
      handleFreight(postalCodeStorage);
    }
  };

  const onInputZipCode = (value) => {
    setZipCode(value);
  };

  const handleFreight = async (zipCode) => {
    if (loading) return;

    setLoading(true);

    try {
      let freightOpt = await fetchFreight(zipCode, currentSku);
      setFreightOptions(freightOpt);
      setZipCodeOnStorage(zipCode);
    } catch (error) {
      console.error("Error handleFreight", error);
    }

    setLoading(false);
  };

  const toggleCollapsedState = () => {
    setCollapsed(!collapsed);
  };

  const setZipCodeOnStorage = async (zipCode) => {
    await Eitri.sharedStorage.setItem("zipCode", zipCode);
  };

  console.log(cmsPDP, "cms");

  return (
    <View paddinTop="small">
      <View>
        <View
          borderColor="secondary-500"
          borderWidth={"hairline"}
          borderRadius="small"
          paddingHorizontal="extra-small"
          paddingVertical="nano"
          display="flex"
          alignItems="center"
          borderStyle="dashed"
          gap={4}
          justifyContent="center"
        >
          <Text fontWeight="bold" color="secondary-500" fontSize="medium">
            Frete Grátis
          </Text>{" "}
          <Text color="secondary-500" fontSize="medium">
            acima de R$79,90 (Sul e Sudeste) e R$149,90 (demais regiões)
          </Text>
        </View>

        <View
          marginTop="small"
          display="flex"
          justifyContent="between"
          gap={12}
          width="100%"
          alignItems="center"
        >
          <CustomInput
            placeholder={t("freight.labelZipCode")}
            value={zipCode}
            maxLength={9}
            mask="99999-999"
            inputMode="numeric"
            onChange={onInputZipCode}
            width="70%"
            borderWidth="hairline"
            borderColor="accent-500"
            borderRadius="small"
            // TODO: verificar com Matheus o porquê da cor não estar funcionando
            // TODO: o problema também afeta o padding
            paddingHorizontal="none"
            color="accent-100"
            maxHeight="40px"
          />

          <CustomButton
            //variant='outlined'
            color="accent-100"
            backgroundColor="secondary-500"
            width="30%"
            label={"CALCULAR"}
            maxHeight="40px"
            onPress={() => handleFreight(zipCode)}
          />
        </View>

        {loading && (
          <View
            mode="skeleton"
            width="100%"
            height="100px"
            borderRadius="small"
          />
        )}

        {
          !loading && freightOptions && freightOptions?.options?.length > 0 && (
            <View
              display="flex"
              direction="column"
              marginVertical="small"
              paddingVertical="small"
              borderWidth="hairline"
              borderColor="neutral-300"
              borderRadius="small"
              alignItems="center"
              gap="10px"
              justifyContent="between"
            >
              {freightOptions?.options.map((item, index) => (
                <View
                  key={index}
                  display="flex"
                  direction="column"
                  alignItems="center"
                  width="100%"
                >
                  <View
                    display="flex"
                    alignItems="center"
                    justifyContent="between"
                    width="100%"
                    paddingHorizontal="small"
                  >
                    <Text color="accent-100" fontWeight="bold">
                      {item?.label}
                    </Text>
                    <Text color="secondary-500">{item?.price}</Text>
                  </View>
                  <View
                    display="flex"
                    alignItems="center"
                    justifyContent="between"
                    width="100%"
                    paddingHorizontal="small"
                  >
                    <Text fontSize="nano" color="neutral-500">
                      {item?.shippingEstimate}
                    </Text>
                  </View>
                  {item.isPickupInPoint && (
                    <View
                      display="flex"
                      alignItems="center"
                      width="100%"
                      paddingHorizontal="small"
                    >
                      <Text fontSize="nano" color="neutral-500">
                        {item.pickUpAddress}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )
          // TODO: verificar qual vai ser o link de redirecionamento
          // <Touchable onPress={() => console.log("Não sei meu frete clicado")}>
          //     <Text color='secondary-300' textDecoration='underline'>Não sei meu cep</Text>
          // </Touchable>
        }
      </View>
    </View>
  );
}

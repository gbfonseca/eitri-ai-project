import SwiperContent from "../SwiperContent";
import { useTranslation } from "eitri-i18n";
import Eitri from "eitri-bifrost";

export default function RoundedBannerList(props) {
  const { data, onPress } = props;
  const imagesList = data.images;

  const { t } = useTranslation();

  const goToCategory = () => {
    Eitri.navigation.navigate({ path: '/Categories' })
  };

  return (
    <View>
      {data?.mainTitle && (
        <View
          display="flex"
          justifyContent="between"
          alignItems="center"
          paddingHorizontal="large"
          marginBottom="large"
        >
          <Text color="accent-100" fontWeight="bold" fontSize="large">
            {data.mainTitle}
          </Text>

          {true && (
            <Touchable
              onPress={goToCategory}
              display="flex"
              alignItems="center"
              gap={3}
              minWidth="fit-content"
            >
              <Text
                fontWeight="bold"
                color="accent-100"
                textDecoration="underline"
              >
                {data?.mainTitle === "QUAL A SUA META?"
                  ? "Saiba mais"
                  : t("shelfOfProducts.seeMore")}
              </Text>

              <Icon
                iconKey="arrow-right"
                color="accent-100"
                width={18}
                height={18}
              />
            </Touchable>
          )}
        </View>
      )}

      <SwiperContent paddingHorizontal="large">
        {imagesList &&
          imagesList.map((slider) => (
            <View
              direction="column"
              key={slider.imageUrl}
              gap={8}
              marginRight="small"
              alignItems="center"
            >
              <Touchable
                key={slider.imageUrl}
                display="flex"
                alignItems="center"
                justifyContent="center"
                backgroundColor="neutral-300"
                borderRadius="pill"
                width={
                  data?.mainTitle === "QUAL A SUA META?" ? "174px" : "118px"
                }
                height={
                  data?.mainTitle === "QUAL A SUA META?" ? "174px" : "118px"
                }
                onPress={() => onPress(slider)}
              >
                <Image
                  src={slider.imageUrl}
                  maxHeight={`${data?.size?.maxHeight}px` || ""}
                  maxWidth={`${data?.size?.maxWidth}px` || ""}
                />
              </Touchable>
              {slider?.subLabel && (
                <Text
                  color="accent-100"
                  fontSize="quark"
                  whiteSpace="nowrap"
                  fontWeight="bold"
                  textAlign="center"
                >
                  {slider?.subLabel}
                </Text>
              )}
            </View>
          ))}
      </SwiperContent>
    </View>
  );
}

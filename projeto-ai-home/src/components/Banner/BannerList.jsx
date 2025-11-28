import SwiperContent from "../SwiperContent";

export default function BannerList(props) {
  const { data, onPress, gap } = props;
  const imagesList = data.images;

  return (
    <View>
      {data?.mainTitle && (
        <View paddingHorizontal="large" marginBottom="extra-small">
          <Text fontWeight="bold" fontSize="large">
            {data.mainTitle}
          </Text>
        </View>
      )}

      <SwiperContent paddingHorizontal="large" gap={gap || 16}>
        {imagesList &&
          imagesList.map((slider) => (
            <View
              direction="column"
              key={slider.imageUrl}
              gap={8}
              alignItems="start"
            >
              <Touchable
                key={slider.imageUrl}
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                onPress={() => onPress(slider)}
              >
                <Image
                  backgroundColor="neutral-100"
                  grow={1}
                  src={slider.imageUrl}
                  maxHeight={data?.size?.maxHeight ? data.size.maxHeight : ""}
                  maxWidth={data?.size?.maxWidth ? data.size.maxWidth : ""}
                  borderRadius="small"
                />
              </Touchable>
              {slider?.subLabel && (
                <Text fontWeight="medium" fontSize="small">
                  {slider?.subLabel}
                </Text>
              )}
            </View>
          ))}
      </SwiperContent>
    </View>
  );
}

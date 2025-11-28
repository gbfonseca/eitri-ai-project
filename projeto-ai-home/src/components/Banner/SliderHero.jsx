import { useEffect } from "react";

export default function SliderHero(props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, onPress } = props;
  const imagesList = data.images;

  const onChangeSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <View position="relative">
      {data.mainTitle && (
        <View
          width="100%"
          paddingHorizontal="large"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="display" fontWeight="bold" marginBottom="large">
            {data.mainTitle}
          </Text>
        </View>
      )}

      <Carousel
        autoplay
        autoplaySpeed={4000}
        afterChange={onChangeSlide}
        initialSlide={currentSlide}
        adaptiveHeight
        infinite
      >
        {imagesList &&
          imagesList.map((slider) => (
            <Touchable
              key={slider.imageUrl}
              onPress={() => onPress(slider)}
              direction="row"
              width="100%"
            >
              <ImageView
                backgroundColor="neutral-100"
                grow={1}
                src={slider.imageUrl}
                width="100%"
                fadeAfterLoaded
                // aspectRatio={data.aspectRatio ?? '4:3'}
              />
            </Touchable>
          ))}
      </Carousel>

      {/* {imagesList.length > 1 && (
        <View
          position="absolute"
          bottom="16px"
          width="100%"
          display="flex"
          gap="10px"
          justifyContent="center"
        >
          {imagesList &&
            Array.from({ length: imagesList.length }, (_, index) => (
              <View
                key={index}
                borderRadius="pill"
                //opacity={currentSlide === index ? 'solid' : 'light'}
                // backgroundColor=currentSlide === index ? 'solid' : 'light'}
                backgroundColor={
                  currentSlide === index ? "secondary-500" : "neutral-500"
                }
                width={currentSlide === index ? "48px" : "16px"}
                height="6px"
                transition="width 300ms ease-in-out, opacity 300ms ease-in-out"
              />
            ))}
        </View>
      )} */}
    </View>
  );
}

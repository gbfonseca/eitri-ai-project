export default function ImageCarousel(props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentSku } = props;

  const beforeChange = (currentSlide, nextSlide) => {
    setCurrentSlide(nextSlide);
  };

  return (
    <View backgroundColor="primary-100" borderRadius="small">
      <Carousel beforeChange={beforeChange} arrows={false}>
        {currentSku?.images?.slice(0, 8).map((item, index) => {
          return (
            <View key={index} paddingVertical="extra-small">
              <View
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={window.screen.width * 0.8}
                borderRadius="small"
                backgroundColor="primary-100"
              >
                <Image
                  src={item.imageUrl}
                  height={window.screen.width * 0.8 * 0.8}
                  maxWidth="80%"
                  backgroundColor="primary-100"
                />
              </View>
            </View>
          );
        })}
      </Carousel>

      {currentSku?.images?.length > 1 && (
        <View
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={8}
          bottom={10}
        >
          {currentSku?.images?.slice(0, 8).map((item, index) => {
            return (
              <View
                key={index}
                display="flex"
                padding="quark"
                borderRadius="circular"
                borderColor="secondary-500"
                borderWidth={currentSlide === index ? "hairline" : "none"}
                backgroundColor="primary-100"
              >
                <View
                  key={index}
                  width="10px"
                  height="10px"
                  backgroundColor={
                    currentSlide === index ? "secondary-500" : "warning-300"
                  }
                  borderRadius="circular"
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

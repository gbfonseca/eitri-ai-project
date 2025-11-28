import Eitri from "eitri-bifrost";
import { renderVideo } from "../../utils/utils";

export default function FullScreen(props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, onPress } = props;

  const [imageHeight, setImageWidth] = useState("");

  useEffect(() => {
    getHeight();
  }, []);

  const getHeight = async () => {
    const configs = await Eitri.getConfigs();
    const headerHeight = document.getElementById("header-container");
    const bottom = configs?.superAppData?.safeAreaInsets?.bottom;
    let _bottomValue = bottom;
    if (configs?.superAppData?.platform === "android") {
      _bottomValue = bottom / window.devicePixelRatio;
    }
    setImageWidth(
      `calc(100vh - ${headerHeight.offsetHeight + _bottomValue}px)`
    );
  };

  const imagesList = data.images;

  const onChangeSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <View position="relative" height={imageHeight} grow={1}>
      <Carousel
        autoplay={data?.autoPlay ?? true}
        autoplaySpeed={4000}
        afterChange={onChangeSlide}
        initialSlide={currentSlide}
        height={"100%"}
        infinite
      >
        {data?.images &&
          data.images.map((slider) => (
            <View position="relative">
              {slider.videoUrl ? (
                <>
                  <Touchable
                    onPress={() => onPress(slider)}
                    position="relative"
                    height={imageHeight}
                  >
                    {renderVideo(slider.videoUrl, slider.imageUrl)}
                  </Touchable>

                  <Touchable
                    onPress={() => onPress(slider)}
                    position="absolute"
                    bottom={0}
                    zIndex={2}
                    backgroundColor="gradient-05"
                    width="100%"
                    height="100%"
                    padding="large"
                    direction="column"
                    alignItems="center"
                    justifyContent="end"
                  >
                    <View>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="42"
                        height="42"
                        color="#fff"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M9.5 13.5C9.99153 14.0057 11.2998 16 12 16M14.5 13.5C14.0085 14.0057 12.7002 16 12 16M12 16V8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </View>
                  </Touchable>
                </>
              ) : (
                <Touchable
                  key={slider.imageUrl}
                  onPress={() => onPress(slider)}
                  backgroundImage={slider.imageUrl}
                  backgroundSize="cover"
                  backgroundPositionY="center"
                  backgroundPositionX="center"
                  width={"100vw"}
                  height={imageHeight}
                ></Touchable>
              )}
            </View>
          ))}
      </Carousel>

      {imagesList.length > 1 && (
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
                opacity={currentSlide === index ? "solid" : "light"}
                backgroundColor="accent-100"
                width={currentSlide === index ? "48px" : "16px"}
                height="6px"
                transition="width 300ms ease-in-out, opacity 300ms ease-in-out"
              />
            ))}
        </View>
      )}
    </View>
  );
}

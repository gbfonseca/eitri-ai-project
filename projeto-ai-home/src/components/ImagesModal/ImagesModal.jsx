export default function ImagesModal(props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentSku } = props;

  const beforeChange = (currentSlide, nextSlide) => {
    setCurrentSlide(nextSlide);
  };

  return (
    <View display="flex" gap={3} marginBottom="nano" width="100%">
      {currentSku?.images?.slice(0, 2).map((item, index) => (
        <Image
          key={index}
          src={item.imageUrl}
          height={140}
          width="auto"
          borderRadius="small"
        />
      ))}
    </View>
  );
}

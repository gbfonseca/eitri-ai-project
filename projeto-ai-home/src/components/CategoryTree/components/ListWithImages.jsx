export default function ListWithImages(props) {
  const { currentShelf, chooseCategory } = props;

  return (
    <View paddingHorizontal={"large"} direction="column" gap={8}>
      {currentShelf?.content?.map((category) => (
        <Touchable
          key={category.title}
          onPress={() => chooseCategory(category)}
          borderRadius="medium"
          height="71px"
          backgroundColor={category.color}
        >
          <View
            paddingHorizontal="large"
            backgroundColor="gradient-01"
            //backgroundColor={category.color}
            borderRadius="medium"
            justifyContent="between"
            alignItems="center"
            width="100%"
            display="flex"
          >
            <Text
              fontFamily="Barlow"
              fontStyle="italic"
              fontSize="medium"
              color="background-color"
              fontWeight="bold"
            >
              {category?.title}
            </Text>
            {category.thumbnail && (
              <View
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="91px"
                height="91px"
                padding="small"
              >
                <Image
                  src={category.thumbnail}
                  maxHeight="100%"
                  maxWidth="100%"
                  width="81px"
                  height="81px"
                />
              </View>
            )}
          </View>
        </Touchable>
      ))}
    </View>
  );
}

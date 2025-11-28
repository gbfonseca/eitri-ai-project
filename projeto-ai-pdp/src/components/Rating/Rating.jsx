export default function Rating(props) {
  const { ratingValue, ratingsCount, ...rest } = props;

  const handleRating = (value) => { };

  // TODO: componente deverá ser retirado do pdp e home para componente compartilhado
  return (
    <View display="flex" alignItems="center" gap="4px">
      <View {...rest} direction="row" alignItems="center" gap={2}>
        {[1].map((star, index) => {
          return (
            <Touchable
              key={index}
              onPress={() => handleRating(star)}
              direction="row"
              alignItems="center"
            >
              <View
                width="22px"
                height="21px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="2px"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="21"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M11 0.238098L14.025 7.6681L22 8.2591L15.895 13.4381L17.8 21.2381L11 17.0121L4.2 21.2381L6.1 13.4381L0 8.2591L7.975 7.6681L11 0.238098Z"
                    fill="#FF9601"
                  />
                </svg>
              </View>
            </Touchable>
          );
        })}
      </View>

      {ratingValue != null && (
        <Text color="white" fontSize="large" fontWeight="400" lineHeight="small">
          {ratingValue}
        </Text>
      )}

      {ratingsCount != null && (
        <Text
        /* // TODO Perguntar para o design se a cor é essa mesma */
          color="secondary-700"
          lineHeight="small"
          fontSize="large"
          fontWeight="400"
        >{`(${ratingsCount})`}</Text>
      )}
    </View>
  );
}

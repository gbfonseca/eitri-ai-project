export default function BlogBanner(props) {
  const { postImg, post, handleClick, marginBottom } = props;

  const category = post?._embedded["wp:term"][0][0].name.toUpperCase();
  const publishedDate = new Date(post?.date).toLocaleDateString("pt-BR");

  return (
    <Touchable
      width="100%"
      position="relative"
      marginBottom={marginBottom}
      onPress={handleClick}
    >
      <ImageView
        src={postImg}
        width="100%"
        height="200px"
        alt={post.title?.rendered}
      />
      <View
        height="100%"
        width="100%"
        position="absolute"
        backgroundColor="gradient-05"
        opacity="half"
        zIndex={1}
      />
      <View
        position="absolute"
        padding="large"
        bottom={0}
        zIndex={2}
        color="accent-100"
      >
        <View
          paddingHorizontal="nano"
          paddingVertical="quark"
          backgroundColor="tertiary-500"
          borderRadius="circular"
          width="fit-content"
        >
          <Text color="accent-100" fontSize="nano">
            {category}
          </Text>
        </View>
        <Text
          color="accent-100"
          marginVertical="nano"
          fontSize="large"
          fontWeight="bold"
        >
          {post.title?.rendered}
        </Text>

        <Text
          color="accent-100"
          fontSize="nano"
        >{`Publicado em ${publishedDate}`}</Text>
      </View>
    </Touchable>
  );
}

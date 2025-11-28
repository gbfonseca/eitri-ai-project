import Eitri from "eitri-bifrost";
import BlogCard from "./BlogCard";
import { Loading } from "projeto-ai-shared";
import SwiperContent from "../SwiperContent";
import thumbnail from "../../assets/images/thumbnail.png";
import { useTranslation } from "eitri-i18n";


export default function BlogPostShelf(props) {
  const { data } = props;
  const { t } = useTranslation();

  const [posts, setPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const url = data?.postUrl;

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const _url = `${url}/wp-json/wp/v2/posts?_embed&per_page=${data?.numberOfItems}`;
      const result = await Eitri.http.get(_url);
      setPosts(result.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSeeMore = () => {
    Eitri.navigation.navigate({ path: "BlogHome", state: { blogUrl: url } });
  };

  const navigateToBlog = (postId) => {
    Eitri.navigation.navigate({
      path: "BlogPost",
      state: { blogUrl: url, postId: postId },
    });
  };

  return (
    <SwiperContent paddingHorizontal="large" title={data.title} gap="16px">
      {isLoading ? (
        <View width="100vw" direction="row" justifyContent="center">
          <Loading />
        </View>
      ) : (
        <>
          {posts
            .filter((post) => !post.categories.includes(1))
            .map((post, index) => {
              let postImg = "";
              postImg =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                thumbnail;

              return (
                <BlogCard
                  key={post.id}
                  postImg={postImg}
                  post={post}
                  handleClick={() => navigateToBlog(post.id)}
                />
              );
            })}

          <Touchable
            padding="medium"
            display="flex"
            direction="column"
            justifyContent="center"
            alignItems="center"
            width="120px"
            height="100%"
            onPress={navigateToSeeMore}
          >
            <Text color="accent-100" fontWeight="bold" marginBottom="nano">
              {t("blogPostShelf.seeMore")}
            </Text>
            <Text color="accent-100" fontWeight="bold">
              +
            </Text>
          </Touchable>
        </>
      )}
    </SwiperContent>
  );
}

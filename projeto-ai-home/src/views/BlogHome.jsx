import Eitri from "eitri-bifrost";
import thumbnail from "../assets/images/thumbnail.png";
import {
    Loading
} from "projeto-ai-shared";
import BlogCard from "../components/Blog/BlogCard";
import BlogBanner from "../components/Blog/BlogBanner";
import HeaderWithReturn from "../components/Header/HeaderWithReturn";
import { logScreenView } from "../services/TrackingService";

export default function BlogHome(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [postsQuantity, setPostsQuantity] = useState(5);
    const [totalPosts, setTotalPosts] = useState(null);

    const blogUrl = props?.location?.state?.blogUrl;

    useEffect(() => {
        logScreenView("Blog", "BlogHome");
    }, []);

    useEffect(() => {
        getPosts(postsQuantity)
        Eitri.navigation.setOnResumeListener(() => {
            console.log("Eitri app was resumed");
        })
    }, [postsQuantity]);

    useEffect(() => {
        Eitri.eventBus.subscribe({
            channel: "onUserTappedActiveTab",
            callback: (_) => {
                Eitri.navigation.backToTop();
            },
        });

        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300 &&
                !isFetchingMore
            ) {
                setIsFetchingMore(true);
                setPostsQuantity((prevQuantity) => prevQuantity + 3);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isFetchingMore]);

    const getPosts = async (postsNum) => {
        try {
            const _url = `${blogUrl}/wp-json/wp/v2/posts?_embed&per_page=${postsNum}`;
            const result = await Eitri.http.get(_url);
            setPosts([...result.data]);
            setIsLoading(false);
            setIsFetchingMore(false);

            if (totalPosts === null) {
                setTotalPosts(parseInt(result.headers["x-wp-total"], 10));
            }
        } catch (error) {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    const getPostImageUrl = (post) => {
        return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || thumbnail;
    };

    const navigateToPost = (postId) => {
        Eitri.navigation.navigate({
            path: "BlogPost",
            state: { blogUrl: blogUrl, postId: postId },
        });
    };

    return (
        <Window bottomInset statusBarTextColor="black">

            <HeaderWithReturn text={"Blog"} />

            <Loading fullScreen isLoading={isLoading} />

            {!isLoading && (
                <>
                    <View display="flex" direction="column" width="100%">
                        {posts
                            .filter((post) => !post.categories.includes(1))
                            .map((post, index) => {
                                const postImg = getPostImageUrl(post);

                                return index < 3 ? (
                                    <BlogBanner
                                        key={post.id}
                                        width="100%"
                                        marginBottom={index === 2 ? "display" : ""}
                                        postImg={postImg}
                                        post={post}
                                        handleClick={() => navigateToPost(post.id)}
                                    />
                                ) : (
                                    <View paddingHorizontal="large">
                                        <BlogCard
                                            key={post.id}
                                            width="100%"
                                            textWidth="292px"
                                            postImg={postImg}
                                            post={post}
                                            handleClick={() => navigateToPost(post.id)}
                                        />
                                    </View>
                                );
                            })}
                    </View>
                    <View width="100vw" direction="row" justifyContent="center">
                        {isFetchingMore && <Loading isLoading={true} />}
                    </View>
                </>
            )}
        </Window>
    );
}

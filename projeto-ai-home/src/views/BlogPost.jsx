import Eitri from 'eitri-bifrost'
import { Loading } from 'projeto-ai-shared'
import HeaderWithReturn from "../components/Header/HeaderWithReturn";
import { logScreenView } from '../services/TrackingService';

export default function BlogPost(props) {

	const PAGE = 'Pagina de postagem do Blog'
	const postId = props?.location?.state?.postId
	const blogUrl = props?.location?.state?.blogUrl

	const [isLoading, setIsLoading] = useState(true)
	const [blogPost, setBlogPost] = useState('')
	const [postImage, setPostImage] = useState('')

	useEffect(() => {
		fetchBlogPost()
		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.backToTop()
			}
		})
		logScreenView(`Blog ${postId}`, "BlogPost");
	}, [])

	const fetchBlogPost = async () => {
		try {
			const _urlBlog = `${blogUrl}/wp-json/wp/v2/posts/${postId}?_embed`
			const response = await Eitri.http.get(_urlBlog)
			const imageUrl = response?.data?._embedded['wp:featuredmedia']?.[0]?.source_url

			setBlogPost(response?.data)
			setPostImage(imageUrl)
			setIsLoading(false)
		} catch (error) {
			setIsLoading(false)
		}
	}

	return (
		<Window
			topInset
			bottomInset>

      <HeaderWithReturn text={"Blog"} />

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			{!isLoading && (
				<>
					<View overflowY='scroll'>
						{postImage && (
							<Image
								src={postImage}
								width='100%'
								marginBottom='large'
							/>
						)}
						<View paddingHorizontal='large'>
							<Text
								fontWeight='bold'
								fontSize='big'
								color='accent-100'
								marginBottom='large'>
								{blogPost?.title?.rendered}
							</Text>
							<HtmlRenderer
								color='accent-100'
								preFormatted
								htmlString={blogPost?.content?.rendered}
							/>
						</View>
					</View>
				</>
			)}
		</Window>
	)
}

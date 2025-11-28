import { getWishlist, removeFromWishlist } from '../services/CustomerService'
import WishlistItem from '../components/WishlistItem/WishlistItem'
import { HeaderText, HeaderContentWrapper, HeaderReturn, Loading, AddedToCartModal } from 'projeto-ai-shared'
import NoItem from '../components/NoItem/NoItem'
import { sendPageView } from '../services/TrackingService'
import { openCart } from '../services/NavigationService'

export default function Wishlist(props) {
	const PAGE = 'MEUS FAVORITOS'
	const [wishlistItems, setWishlistItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [showAddedToCartModal, setShowAddedToCartModal] = useState(false);
	const [loadingCartOp, setLoadingCartOp] = useState(false);

	useEffect(() => {
		start()
		sendPageView(PAGE, 'Wishlist')
	}, [])

	const start = async () => {
		setIsLoading(true)
		const result = await getWishlist().catch(e => {
			console.log('Error:', e)
			return []
		})
		setWishlistItems(result)
		setIsLoading(false)
	}

	const onRemoveFromWishList = async id => {
		try {
			setIsLoading(true)
			await removeFromWishlist(id)
			const filtered = wishlistItems.filter(item => item.id !== id)
			setWishlistItems(filtered)
			setIsLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	const handleOpenCart = () => {
		openCart();
		setShowAddedToCartModal(false);
	};

	const handleKeepShopping = () => {
		setShowAddedToCartModal(false);
	};

	return (
		<Window bottomInset topInset title={PAGE}>

			<HeaderContentWrapper
				gap={16}
				borderBottomWidth='hairline'
				borderColor="primary-300"
			>
				<HeaderReturn iconColor="secondary-500" />
				<HeaderText text={'MEUS FAVORITOS'} />
			</HeaderContentWrapper>

			<Loading
				isLoading={isLoading}
				fullScreen
			/>

			<View marginTop='large'>
				{wishlistItems.length === 0 && !isLoading ? (
					<NoItem
						title='Você não possui nenhum item salvo'
						subtitle='Quando você salvar um produto, ele será listado aqui.'
					/>
				) : (
					<View
						display='flex'
						width='100%'
						flexDirection='row'
						flexWrap='wrap'
						justifyContent='space-between'
						alignItems='center'
					>
						{wishlistItems?.map((item, index) => (
							<View
								key={item.id}
								width='50%'
								paddingRight='nano'
								paddingLeft='nano'
							>
								<WishlistItem
									productId={wishlistItems[index].productId}
									onRemoveFromWishlist={() => onRemoveFromWishList(wishlistItems[index].id)}
									showModal={setShowAddedToCartModal}
								/>
							</View>
						))}
					</View>
				)}
			</View>

			<AddedToCartModal
				showModal={showAddedToCartModal}
				onClose={() => setShowAddedToCartModal(false)}
				onPressOpenCart={handleOpenCart}
				onPressKeepShopping={handleKeepShopping}
			/>
		</Window>
	)
}

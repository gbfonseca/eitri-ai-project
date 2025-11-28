import WishlistIcon from '../WishlistIcon/WishlistIcon'

export default function HeaderWishlist(props) {
	const { isOnWishlist, onPress } = props
	return (
		<Touchable
			onPress={onPress}
			display='flex'
			width={'100%'}>
			<Icon
				iconKey='bookmark'
				width={24}
				height={24}
			/>
		</Touchable>
	)
}

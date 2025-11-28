import Loading from '../Loading/Loading'
import WishlistIcon from '../WishlistIcon/WishlistIcon'
import Quantity from './components/Quantity'

export default function ProductCardConvenience(props) {
	const {
		listPrice,
		image,
		name,
		price,
		width,
		itemQuantity,
		isInCart,
		loadingCartOp,
		loadingWishlistOp,
		isOnWishlist,
		showListItem,
		onPressOnCard,
		onPressCartButton,
		onPressOnWishlist,
		onChangeQuantity,
		t
	} = props

	return (
		<View
			position='relative'
			backgroundColor={'accent-100'}
			minWidth={width || 'auto'}
			maxWidth={width || 'auto'}
			borderRadius='small'
			elevation='low'>
			<View direction='column'>
				<Touchable
					onPress={onPressOnCard}
					position='relative'
					display='flex'
					direction='column'
					width='100%'
					justifyContent='center'
					borderRadius='micro'
					alignItems='center'
					height='200px'
					minHeight='200px'
					maxHeight='200px'>
					<Image
						src={image}
						maxWidth='100%'
						maxHeight='100%'
					/>
					<View
						position='absolute'
						top='5px'
						right='5px'
						width='30px'
						height='30px'
						display='flex'
						alignItems='center'
						justifyContent='center'
						borderRadius='circular'
						backgroundColor='accent-100'>
						<Touchable
							disabled={loadingWishlistOp}
							onPress={onPressOnWishlist}
							zIndex={98}>
							<WishlistIcon checked={isOnWishlist} />
						</Touchable>
					</View>
				</Touchable>

				<View
					padding='small'
					direction='column'
					gap={8}>
					<View
						display='flex'
						justifyContent='between'
						maxHeight='36px'
						minHeight='36px'
						gap={4}>
						<Text
							lineClamp={2}
							fontWeight='medium'
							fontSize='extra-small'>
							{name}
						</Text>
					</View>

					<View
						direction='column'
						gap={2}>
						{showListItem && (
							<>
								{listPrice ? (
									<Text
										textDecoration='line-through'
										fontWeight='bold'
										color='neutral-500'
										fontSize='nano'>
										{listPrice}
									</Text>
								) : (
									<View height='16px' />
								)}
							</>
						)}

						<View
							direction='row'
							width='100%'
							justifyContent='between'
							alignItems='center'>
							<Text
								fontWeight='bold'
								color='primary-500'
								fontSize='small'>
								{price}
							</Text>
						</View>

						{isInCart ? (
							<Quantity
								quantity={itemQuantity}
								handleItemQuantity={onChangeQuantity}
								marginTop='nano'
							/>
						) : (
							<Touchable
								marginTop='nano'
								height='36px'
								width='100%'
								borderRadius='small'
								display='flex'
								justifyContent='center'
								alignItems='center'
								borderColor={'secondary-500'}
								borderWidth='hairline'
								backgroundColor={loadingCartOp ? 'neutral-100' : 'secondary-500'}
								zIndex={99}
								onPress={onPressCartButton}>
								{loadingCartOp ? (
									<Loading width='36px' />
								) : (
									<Text
										color='background-color'
										fontWeight='medium'
										textTransform='uppercase'
										fontSize='extra-small'>
										{isInCart ? t('productCardVertical.cart') : t('productCardVertical.buy')}
									</Text>
								)}
							</Touchable>
						)}
					</View>
				</View>
			</View>
		</View>
	)
}

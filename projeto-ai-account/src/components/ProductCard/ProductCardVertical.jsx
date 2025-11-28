import { CustomButton } from 'projeto-ai-shared'
import wishilist from '../../assets/images/heart-icon.svg'
import Rating from '../Rating/Rating'

export default function ProductCardVertical(props) {
	const {
		ratingValue,
		ratingsCount,
		listPrice,
		image,
		name,
		price,
		width,
		installments,
		onWishListPress,
		onPress,
		badge,
		addToCart,
		loadingCartOp,
		item
	} = props

	const onPressCard = () => {
		if (onPress && typeof onPress === 'function') {
			onPress()
		}
	}

	return (
		<View
			position='relative'
			minWidth={width || 'auto'}
			maxWidth={width || 'auto'}
			borderRadius='small'
			padding='small'
			backgroundColor='accent-100'
			marginBottom='medium'
		>
			<Touchable onPress={onPressCard} marginBottom='medium'>
				<View direction='column'>
					<View
						display='flex'
						justifyContent='between'
						alignItems='center'
					>
						{badge ? (
							<View
								minHeight='17px'
								borderRadius='pill'
								width='fit-content'
								paddingHorizontal='nano'
								paddingVertical='quark'
								backgroundColor='primary-900'
							>
								<Text
									block
									fontWeight='bold'
								>
									{badge}
								</Text>
							</View>
						) : (
							<View height='10px' />
						)}
						<Touchable
							zIndex={99}
							onPress={onWishListPress}>
							<Image
								src={wishilist}
								width='24px'
								height='24px'
							/>
						</Touchable>
					</View>

					<View
						display='flex'
						width='100%'
						justifyContent='center'
						borderRadius='micro'
						alignItems='center'>
						<Image
							src={image}
							maxWidth='100%'
							borderRadius='micro'
							maxHeight='100%'
						/>
					</View>

					<View
						marginTop='small'
						display='flex'
						justifyContent='between'
						maxHeight='36px'
						minHeight='36px'
						gap={4}
					>
						<Text
							block
							lineClamp={3}
							fontWeight='medium'
							color='primary-300'
							fontSize='extra-small'
						>
							{name}
						</Text>
					</View>

					<View marginTop='quark'>
						{ratingValue ? (
							<Rating
								ratingValue={ratingValue}
								ratingsCount={ratingsCount}
							/>
						) : (
							<View height='16px' />
						)}
					</View>
					<View
						direction='column'
						gap={2}
						marginTop='nano'>
						{listPrice ? (
							<Text
								block
								textDecoration='line-through'
								fontWeight='bold'
								color='neutral-500'
								fontSize='nano'>
								{listPrice}
							</Text>
						) : (
							<View height='16px' />
						)}

						<Text
							block
							fontWeight='bold'
							color='primary-700'
							fontSize='small'>
							{price}
						</Text>
					</View>
				</View>
			</Touchable>

			<View>
				<CustomButton
					width='100%'
					height='34px'
					label={"ADICIONAR"}
					onPress={() => addToCart(item)}
					isLoading={loadingCartOp}
					loadingHeight='34px'
					loadingWidth='34px'
				/>
			</View>
		</View>
	)
}

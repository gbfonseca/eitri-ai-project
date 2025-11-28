export default function Quantity(props) {
	const { quantity, handleItemQuantity, disable, ...rest } = props

	const _handleItemQuantity = value => {
		handleItemQuantity(quantity + value)
	}

	return (
		<View
			display='flex'
			borderWidth='hairline'
			borderColor='primary-500'
			borderRadius='small'
			paddingHorizontal='small'
			width='100%'
			height='35px'
			justifyContent='between'
			alignItems='center'
			{...rest}>
			<View
				height='100%'
				display='flex'
				alignItems='center'
				justifyContent='start'>
				<Touchable onPress={() => _handleItemQuantity(-1)}>
					<Icon
						iconKey='minus'
						width={16}
						height={16}
						color={disable ? 'neutral-300' : 'primary-500'}
					/>
				</Touchable>
			</View>
			<View
				alignItems='center'
				justifyContent='center'>
				<Text fontWeight='bold'>{quantity}</Text>
			</View>
			<View
				display='flex'
				alignItems='center'
				justifyContent='end'>
				<Touchable onPress={() => _handleItemQuantity(1)}>
					<Icon
						iconKey='plus'
						width={16}
						height={16}
						color={disable ? 'neutral-300' : 'primary-500'}
					/>
				</Touchable>
			</View>
		</View>
	)
}

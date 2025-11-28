export default function ProfileCardButton(props) {
	const { icon, label, onPress } = props

	return (
		<Touchable
      backgroundColor='primary-100'
			borderRadius='micro'
			elevation='low'
			width='100%'
			padding='large'
			display='flex'
			justifyContent='between'
			onPress={onPress}>
			<View
				display='flex'
				alignItems='center'>
				<Icon
					iconKey={icon}
					width={24}
					height={24}
					color='accent-100'
				/>
				<Text
					color='accent-100'
					fontSize='small'
					marginLeft='nano'>
					{label}
				</Text>
			</View>
			<Icon
				iconKey={'chevron-right'}
				width={24}
				height={24}
				color='secondary-500'
			/>
		</Touchable>
	)
}

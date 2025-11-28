export default function CategoryCard(props) {
	const { icon, label, bgColor } = props
	return (
		<View
			display='flex'
			direction='column'
			alignItems='center'
			borderRadius='circular'
			backgroundColor={bgColor}
			paddingHorizontal='display'
			paddingVertical='small'
			minWidth={'108px'}>
			<Image
				src={icon}
				marginBottom='large'
			/>
			<Text
				fontSize='small'
				whiteSpace='nowrap'
				fontWeight='bold'>
				{label}
			</Text>
		</View>
	)
}

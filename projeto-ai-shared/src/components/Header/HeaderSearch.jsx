import search from '../../assets/images/search.svg'

export default function HeaderSearch(props) {
	const { onPress, labelSearch } = props

	return (
		<Touchable
			width='100%'
			onPress={onPress}>
			<View
				borderRadius='pill'
				backgroundColor='neutral-100'
				borderColor='neutral-300'
				borderWidth='hairline'
				display='flex'
				alignItems='center'
				justifyContent='between'
				paddingVertical='small'
				paddingLeft='large'
				maxHeight='40px'
				width='100%'
				paddingHorizontal='extra-small'
				>
				<Text
					color='neutral-500'
					fontFamily='Baloo2'
					fontSize='extra-small'
					fontWeight='bold'>
					{labelSearch || 'Pesquisar...'}
				</Text>
			
				<Image
					src={search}
				/>
			</View>
		</Touchable>
	)
}

import { getTopSearches } from '../../services/CatalogService'

export default function TopSearches(props) {
	const { onSubmit, ...rest } = props

	const [searches, setSearches] = useState([])

	useEffect(() => {
		getTopSearches()
			.then(res => {
				const searches = res?.searches
				setSearches(searches)
			})
			.catch(err => { })
	}, [])

	return (
		<View

			padding='large'
			{...rest}>
			<Text
				fontWeight='bold'
				fontSize='small'>
				Termos mais buscados
			</Text>
			<View
				display='flex'
				direction="column"
				gap={8}
				marginTop='small'>
				{searches?.map((search, index) => (
					<Touchable
						key={search?.term}
						width='fit-content'
						padding='nano'
						paddingHorizontal='small'
						onPress={() => onSubmit(search?.term)}>
						<View
							display='flex'
							alignItems="center"
							gap={10}>
							<View
								backgroundColor="secondary-500"
								width="30px"
								height="30px"
								display="flex"
								alignItems="center"
								justifyContent="center"
								borderRadius="pill"
							>
								<Text
									fontWeight="bold"
									fontSize="small"
									display="block"
								>
									{index + 1}
								</Text>
							</View>
							<Text fontWeight='bold'>{search?.term}</Text>
						</View>
					</Touchable>
				))}
			</View>
		</View>
	)
}

import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { resolveNavigation } from '../../services/NavigationService'

export default function CategoryAccordion(props) {
	const { data } = props

	const [openIndex, setOpenIndex] = useState(null)

	const toggleAccordion = index => {
		setOpenIndex(openIndex === index ? null : index)
	}

	const legacySearch = Vtex?.configs?.searchOptions?.legacySearch

	useEffect(() => {
		if (data?.shelfs) {
			setCurrentShelf(data.shelfs[0])
		}
	}, [data?.shelfs])

	const goToCategoryPage = category => {
		if (legacySearch) {
			Eitri.navigation.navigate({
				path: 'ProductCatalog',
				state: {
					facets: category.facets,
					title: category.title
				}
			})
			return
		}

		resolveNavigation(category.path, category.title)
	}
	

	return (
		<View
			width='100%'
			direction='column'
			gap={4}
			paddingHorizontal='large'>
			{data?.content?.map((category, index) =>
			 (
				<View key={index}>
					<View
						direction='row'
						alignItems='center'
						borderBottomWidth='hairline'
						paddingVertical='nano'
						borderColor='neutral-300'
						width='100%'
						justifyContent='between'>
						<Touchable width='100%' onPress={() => goToCategoryPage(category)} direction='row' alignItems='center' gap={4}>
							{category.imageUrl && <Image
								src={category.imageUrl}
								width={24}
								height={24}
							/>
							}
							<Text
								fontSize='large'
								fontWeight='bold'
								whiteSpace='nowrap'
								textTransform='uppercase'
								padding='nano'>
								{category.title}
							</Text>
						</Touchable>
						{Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
							<Touchable
								onPress={() => toggleAccordion(index)}
								width='100%'
								direction='row'
								justifyContent='end'>
								<Icon
									iconKey='chevron-right'
									transform={openIndex === index ? 'rotate(90deg)' : 'rotate(0deg)'}
									transition='transform 0.2s ease-in-out'
									width={24}
									height={24}
								/>
							</Touchable>
						)}
					</View>
					{openIndex === index && (
						<View
							padding='nano'
							visibility={openIndex === index ? 'visible' : 'hidden'}
							height='auto'
							transition='height 0.35s ease-in-out'>
							{category.subcategories.map((subcategory, subIndex) => (
								<View
									key={subIndex}
									height={openIndex === index ? 'auto' : 0}
									marginBottom='quark'>
									<Touchable onPress={() => goToCategoryPage(subcategory)}>
										<Text
											fontSize='small'
											fontWeight='normal'
											color='neutral-500'
											textTransform='uppercase'
											padding='nano'>
											{subcategory.title}
										</Text>
									</Touchable>
								</View>
							))}
						</View>
					)}
				</View>
			))}
		</View>
	)
}
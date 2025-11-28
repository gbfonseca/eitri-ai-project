import { HeaderSearchIcon, Loading, BottomBar, HeaderContentWrapper, HeaderText } from 'projeto-ai-shared'
import { getCmsContent } from '../services/CmsService'
import { getMappedComponent } from '../utils/getMappedComponent'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { logScreenView } from '../services/TrackingService'

export default function Categories() {
	const [cmsContent, setCmsContent] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	const { t } = useTranslation()

	useEffect(() => {
		loadCms()

		Eitri.navigation.setOnResumeListener(() => {
			logScreenView(`Categorias`, "Categories")
		})
		
	}, [])

	const loadCms = async () => {
		const { sections } = await getCmsContent('categories', 'categorias')

		setCmsContent(sections)

		setIsLoading(false)
	}

	const goToSearch = () => {
		Eitri.navigation.navigate({ path: '/Search' })
	}

	return (
		<Window
			bottomInset
			topInset>

			<HeaderContentWrapper
				justifyContent='between'
				alignItems='center'>
				<HeaderText text={t('categories.title')} />
				<HeaderSearchIcon onPress={goToSearch} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>
			<View
				paddingVertical='display'
				direction='column'
				gap='32px'
				marginTop='extra-small'>
				{cmsContent?.map(content => getMappedComponent(content))}
			</View>
			<BottomBar currentPage={1} />
		</Window>
	)
}

import { getRemoteAppConfigProperty } from '../../utils/getRemoteConfigStyleProperty'

export default function HeaderLogo(props) {
	const { src } = props

	const [urlLogo, setUrlLogo] = useState('')

	useEffect(() => {
		getConfigs()
	}, [])

	const getConfigs = async () => {
		try {
			if (src) {
				setUrlLogo(src)
			} else {
				const headerLogo = await getRemoteAppConfigProperty('headerLogo')
				setUrlLogo(headerLogo)
			}
		} catch (error) {
			console.error('Erro ao obter configurações remotas:', error)
		}
	}

	return (
		<View
			maxWidth={'170px'}
			display='flex'
			alignItems='center'>
			<Image
				src={urlLogo}
				maxWidth='100%'
				maxHeight={'100%'}
			/>
		</View>
	)
}

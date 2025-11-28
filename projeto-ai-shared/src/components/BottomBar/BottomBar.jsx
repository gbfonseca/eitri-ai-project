import Eitri from 'eitri-bifrost'

/**
 * Fake Bottom Bar para simular no Eitri-Play
 * @param {Object} props - Props for Bottom bar.
 * @param {number} props.currentPage
 * @returns
 */
export default function BottomBar(props) {
	const {currentPage} = props
    const [renderFakeBottomBar, setRenderFakeBottomBar] = useState(null)

    useEffect(() => {
        renderFakeBottom()
    }, [])
    
    const renderFakeBottom = async () => {
        const {eitriConfig} = await Eitri.environment.getRemoteConfigs()
		setRenderFakeBottomBar(eitriConfig.renderFakeBottomBar ?? false)
    }

	const navigateTo = async (slug, route) => {

        if(slug === 'eitri-shop-blackskull-home' && (currentPage === 0 || currentPage === 1)) {
            return await Eitri.navigation.navigate({
			    path: route,
		    })
        }

		await Eitri.nativeNavigation.open({
			slug: slug,
			initParams: route
				? {
						openRoute: {
							path: route
						}
				  }
				: undefined
		})
	}

	const renderIcon = (btnId, size, stroke) => {
		return (
			<Icon
				height={size}
				iconKey={btnId}
				color={stroke}
			/>
		)
	}

	const getButton = (btnId, icon, label, slug, route) => {
		return (
			<Touchable
				direction='column'
				alignSelf='center'
				alignItems='center'
				justifyContent='center'
				height={78}
				onPress={async () => await navigateTo(slug, route)}
				grow={1}>
				{renderIcon(
					icon,
					btnId === currentPage ? 32 : 29,
					btnId === currentPage ? 'primary-700' : 'text-color-500'
				)}
				<Text
					marginTop={'quark'}
					color={btnId === currentPage ? 'primary-700' : 'text-color-500'}
					fontSize='nano'>
					{label}
				</Text>
			</Touchable>
		)
	}

    
	if (currentPage === null || currentPage === undefined) {
        return null
	}
    
    if(!renderFakeBottomBar) return null

	return (
		<>
			<View
				position='fixed'
				bottom={0}
				left={0}
				right={0}
				height={78}
				elevation={'highest'}
				customColor='#ffffff'
				direction='row'
				justifyContent='between'>
				{getButton(0, 'home', 'Home', 'eitri-shop-blackskull-home', '/')}

				{getButton(1, 'list', 'Categoria', 'eitri-shop-blackskull-home', '/Categories')}

				{getButton(2, 'user', 'Perfil', 'eitri-shop-blackskull-account')}

				{/* {getButton(3, 'shopping-cart', 'Carrinho', 'eitri-shop-blackskull-cart')} */}
			</View>

			<View height={78} />
		</>
	)
}

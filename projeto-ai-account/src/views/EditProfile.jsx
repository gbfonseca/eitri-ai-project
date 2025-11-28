import formatDate from '../utils/Date'
import { getCustomerData, setCustomerData } from '../services/CustomerService'
import { sendPageView } from '../services/TrackingService'
import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	CustomInput,
	HeaderContentWrapper, HeaderReturn, HeaderText,
	Loading
} from 'projeto-ai-shared'
import { useTranslation } from 'eitri-i18n'
import { navigate, PAGES } from '../services/NavigationService'

export default function EditProfile(props) {
	const PAGE = 'MINHA CONTA'
	const [user, setUser] = useState({})
	const { t } = useTranslation()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const customerData = props?.location?.state?.customerData

		if (!customerData) {
			loadMe()
		} else {
			setUser({
				...user,
				...customerData,
				birthDate: formatDate(customerData?.birthDate)
			})
		}

		sendPageView('Editar perfil', 'EditProfile')
	}, [])

	const handleInputChange = (target, value) => {
		setUser({
			...user,
			[target]: value
		})
	}

	const handleSave = async () => {
		setIsLoading(true)
		const { isValid, isoDate } = convertToISO(user.birthDate)
		if (!isValid) {
			setIsLoading(false)
			return
		}
		const updatedUser = await setCustomerData({ ...user, birthDate: isoDate })
		setUser({ ...updatedUser, birthDate: formatDate(updatedUser?.birthDate) })
		setIsLoading(false)
	}

	const loadMe = async () => {
		setIsLoading(true)
		const customerData = await getCustomerData()
		setUser({ ...customerData, birthDate: formatDate(customerData?.birthDate) })
		setIsLoading(false)
	}

	function convertToISO(dateStr) {
		const dt = dateStr.replaceAll('/', '')
		const day = parseInt(dt.substring(0, 2), 10)
		const month = parseInt(dt.substring(2, 4), 10)
		const year = parseInt(dt.substring(4, 8), 10)

		const date = new Date(year, month - 1, day)

		// Valid date
		let isValid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

		if (!isValid) {
			return { isValid }
		}

		// More than 18 years
		const today = new Date()

		isValid =
			today.getFullYear() - year > 18 ||
			(today.getFullYear() - year === 18 && today.getMonth() > month) ||
			(today.getFullYear() - year === 18 && today.getMonth() === month && today.getDate() >= day)

		if (!isValid) {
			return { isValid }
		}

		return { isValid, isoDate: date.toISOString() }
	}

	const handleRemoveAccount = async () => {
		Eitri.openBrowser({ url: 'https://forms.gle/iW8EkNx7Yy3jpEVU6', inApp: true })
	}


	return (
		<Window bottomInset topInset title={PAGE}>

			<HeaderContentWrapper
				borderBottomWidth='hairline'
				borderColor="primary-100"
			>
				<HeaderReturn iconColor="secondary-500" />
				<HeaderText
					text={"MINHA CONTA"}
					marginHorizontal="large"
				/>
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			<View
				padding='large'
				direction='column'
				gap='16px'
			>
				<View>
					<Text
						fontWeight='bold'
						fontSize='big'
					>
						{t("myAccount.editProfile")}
					</Text>
				</View>
				<View>
					<Text
						color='accent-100'
						block
						fontWeight='bold'
						fontSize='extra-small'
					>
						{t("myAccount.fields.name")}
					</Text>
					<View
						marginTop='nano'
						display='flex'
						gap='6px'
					>
						<CustomInput
							placeholder={t("myAccount.fields.name")}
							value={user?.firstName || ''}
							onChange={value => handleInputChange('firstName', value)}
						/>
					</View>
				</View>

				<View>
					<Text
						color='accent-100'
						block
						marginBottom='nano'
						fontWeight='bold'
						fontSize='extra-small'
					>
						{t("myAccount.fields.birthDate")}
					</Text>
					<CustomInput
						placeholder='DD/MM/AAAA'
						inputMode='numeric'
						mask='99/99/9999'
						value={user?.birthDate || ''}
						onChange={value => handleInputChange('birthDate', value)}
					/>
				</View>

				<View>
					<Text
						color='accent-100'
						block
						fontWeight='bold'
						fontSize='extra-small'
					>
						{t("myAccount.fields.email")}
					</Text>
					<View
						marginTop='nano'
						display='flex'
						gap='6px'
					>
						<CustomInput
							placeholder={t("myAccount.fields.email")}
							value={user?.email || ''}
							onChange={value => handleInputChange('email', value)}
						/>
					</View>
				</View>

				<View>
					<Text
						color='accent-100'
						block
						marginBottom='nano'
						fontWeight='bold'
						fontSize='extra-small'
					>
						{t("myAccount.fields.cpf")}
					</Text>
					<CustomInput
						placeholder='000.000.000-00'
						value={user.document || ''}
						inputMode='numeric'
						onChange={value => handleInputChange('document', value)}
						mask='999.999.999-99'
					/>
				</View>


				<View>
					<Text
						color='accent-100'
						block
						marginBottom='nano'
						fontWeight='bold'
						fontSize='extra-small'
					>
						{t("myAccount.fields.password")}
					</Text>
					<CustomInput
						placeholder={t("myAccount.fields.password")}
						value={user?.password || ''}
						type="password"
						backgroundColor="primary-100"
						borderColor="primary-100"
					/>
				</View>

				<View
					marginTop='large'
				>
					<Touchable
						onPress={() => navigate(PAGES.PASSWORD_RESET)}
					>
						<Text
							color='secondary-500'
							block
							marginBottom='nano'
							fontWeight='bold'
							fontSize='extra-small'
							textDecoration='underline'
						>
							{t("myAccount.fields.changePassword")}
						</Text>
					</Touchable>
				</View>

				<View>
					<Text
						color='accent-100'
						block
						marginBottom='nano'
						fontWeight='bold'
						fontSize='extra-small'
					>
						{t("myAccount.fields.gender")}
					</Text>
					<View
						display='flex'
						gap='30px'
						justifySelf="between"
					>
						<View
							direction='row'
							align='center'
							alignItems='center'
						>
							<Radio
								value={'male'}
								checked={user?.gender === 'male'}
								onChange={value => handleInputChange('gender', value)}
							/>
							<Text
								color='accent-100'
								block
								marginLeft='nano'>
								{t("myAccount.fields.male")}
							</Text>
						</View>

						<View
							direction='row'
							align='center'
							alignItems='center'
						>
							<Radio
								value={'female'}
								checked={user?.gender === 'female'}
								onChange={value => handleInputChange('gender', value)}
							/>
							<Text
								block
								color='accent-100'
								marginLeft='nano'>
								{t("myAccount.fields.female")}
							</Text>
						</View>


						<View
							direction='row'
							align='center'
							alignItems='center'
						>
							<Radio
								value={'other'}
								checked={user?.gender === 'other'}
								onChange={value => handleInputChange('gender', value)}
							/>
							<Text
								block
								color='accent-100'
								marginLeft='nano'>
								{t("myAccount.fields.other")}
							</Text>
						</View>
					</View>
				</View>

				<View>
					<CustomButton
						width='100%'
						label='Salvar'
						onPress={handleSave}
					/>
				</View>
			</View>
		</Window>
	)
}

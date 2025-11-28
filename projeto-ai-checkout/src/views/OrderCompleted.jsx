import Eitri from 'eitri-bifrost'
import { goHome, openAccount } from '../services/navigationService'
import { useTranslation } from 'eitri-i18n'
import { trackScreenView } from '../services/Tracking'
import { Page, Text, View } from 'eitri-luminus'
import { useEffect } from 'react'
import HeaderContentWrapper from '../components/Shared/Header/HeaderContentWrapper'
import HeaderReturn from '../components/Shared/Header/HeaderReturn'
import HeaderText from '../components/Shared/Header/HeaderText'
import CustomButton from '../components/Shared/CustomButton/CustomButton'
import BottomInset from '../components/Shared/BottomInset/BottomInset'

export default function OrderCompleted(props) {
	const orderId = props.location?.state?.orderId
	const { t } = useTranslation()

	useEffect(() => {
		requestAppReview()
		trackScreenView(`checkout_pedido_realizado`, 'checkout.orderCompleted')
	}, [])

	const requestAppReview = async () => {
		try {
			await Eitri.appStore.requestInAppReview()
			console.log('Solicitação de avaliação enviada com sucesso!')
		} catch (error) {
			console.error('Erro ao solicitar avaliação do app:', error)
		}
	}

	return (
		<Page>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Pedido concluído'} />
			</HeaderContentWrapper>

			<View className='p-4'>
				{/* Payment Confirmation Section */}
				<View className='bg-base-200 rounded p-4'>
					<View className='flex flex-col items-center justify-center mb-4 gap-2'>
						<View className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center'>
							<Text className='text-2xl'>✓</Text>
						</View>
						<Text className='text-xl font-bold text-center'>Pronto, compra feita!</Text>
					</View>

					<View className='flex flex-col items-center'>
						<Text className='text-center text'>
							Enviamos uma confirmação com os detalhes do seu pedido para seu email
						</Text>
					</View>

					<View className='flex flex-col items-center mt-4'>
						<Text className='text-center text-sm'>Seu código de pedido é</Text>
						<Text className='font-bold text-center text-lg'>{orderId}</Text>
					</View>
				</View>

				<View className='flex flex-col gap-4 mt-6'>
					<CustomButton
						label='Ver meus pedidos'
						onClick={openAccount}
					/>
					<CustomButton
						outlined
						label='Voltar ao início'
						onClick={goHome}
					/>
				</View>

				<BottomInset />
			</View>
		</Page>
	)
}

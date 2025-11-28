import Eitri from 'eitri-bifrost'
import { Tracking } from "eitri-shopping-vtex-shared";

export const sendViewItem = async product => {
	const _item = product?.items[0]
	const categories = product?.categories?.length > 0 ? product.categories[0]
		?.split('/')
		?.filter(Boolean)
		?.reduce((acc, curr, index) => {
			if (index === 0) {
				acc[`item_category`] = curr
			} else {
				acc[`item_category${index + 1}`] = curr
			}
			return acc
		}, {})
		: {}

	const item = {
		currency: 'BRL',
		value: _item.sellers[0].Price,
		items: [
			{
				item_id: _item.itemId,
				item_name: _item.name,
				item_brand: product.brand,
				...categories,
				price: _item.sellers[0].Price
			}
		]
	}

	logEvent('view_item', item)
}

export const crashLog = async message => {
	try {
		if (Eitri.exposedApis?.fb) {
			await Eitri.exposedApis.fb.crashLog({ message })
		}
	} catch (error) {
		console.log('Erro ao logar evento', error)
	}
}

export const crash = async () => {
	try {
		if (Eitri.exposedApis?.fb) {
			await Eitri.exposedApis.fb.crash()
		}
	} catch (error) {
		console.log('Erro ao logar evento', error)
	}
}

export const sendPageView = async (friendlyPageName, pageClass) => {
	try {
		Tracking.ga.logScreenView(friendlyPageName, pageClass)
	} catch (e) {}
}

export const logEvent = async (event, data) => {
	try {
		Tracking.ga.logEvent(event, data)
	} catch (e) {}
}

export const logError = async (event, error) => {
	try {
		Tracking.ga.logError(event, error)
	} catch (e) {}
}

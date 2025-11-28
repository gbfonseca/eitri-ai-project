import { Vtex } from 'eitri-shopping-vtex-shared'
import Eitri from 'eitri-bifrost'

let CheckLoginPromise = null

export const requestLogin = () => {
	return new Promise((resolve, reject) => {
		Eitri.nativeNavigation.open({
			slug: 'eitri-shop-blackskull-account',
			initParams: { action: 'RequestLogin' }
		})
		CheckLoginPromise = null
		Eitri.navigation.setOnResumeListener(resolve)
	})
}

export const isLoggedIn = async () => {
	// await Vtex.customer.loginWithEmailAndAccessKey('wagnerfq@gmail.com', '680893')
	if (CheckLoginPromise) {
		return CheckLoginPromise
	}
	CheckLoginPromise = Vtex.customer.isLoggedIn()
	return CheckLoginPromise
}

export const productOnWishlist = async productId => {
	if (!(await isLoggedIn())) {
		return { inList: false }
	}
	const result = await Vtex.wishlist.checkItem(productId)
	const inList = result?.data?.checkList?.inList
	if (inList) {
		const listId = result?.data?.checkList?.listIds?.[0]
		return { inList, listId }
	} else {
		return { inList }
	}
}

export const removeItemFromWishlist = async id => {
	return await Vtex.wishlist.removeItem(id)
}

export const addToWishlist = async (productId, title, sku) => {
	let result
	try {
		if (!(await isLoggedIn())) {
			await requestLogin()
			if (!(await isLoggedIn())) {
				throw new Error('User not logged in')
			}
			result =  await Vtex.wishlist.addItem(productId, title, sku)
		} else {
			result =  await Vtex.wishlist.addItem(productId, title, sku)
		}

		logEvent('add_to_wishlist', {
			currency: 'BRL',
			value: result?.data?.addToList?.price || '',
			items: [{ item_id: productId, item_name: title, item_variant: sku }]
		})

		return result
	} catch (e) {
		console.error('Erro ao adicionar item à lista de desejos', e)
	}
}

export const getOrders = async () => {
	const orders = await Vtex.customer.listOrders()
	return orders
}

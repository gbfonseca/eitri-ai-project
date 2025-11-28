
import { Tracking } from "eitri-shopping-vtex-shared";

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

export const trackingViewCart = async (cart) => {
  logEvent('view_cart', {
    currency: 'BRL',
    value: Number(cart.value) ? (cart.value / 100).toFixed(2) : '',
    items: cart?.items.map(item => {
      item.price = Number(item.price) ? (item.price / 100).toFixed(2) : ''
      const _item = mountCartItems(item, item?.quantity || 1)
      return _item
    })
  })
}

export const mountCartItems = (product, quantity, itemListId, itemListName) => {
		
	const _item = Array.isArray(product?.items) ? product?.items[0] : product
	
	const _categories = product?.categories?.length > 0 ? product.categories[0] : ''
	const categories = _categories?.split('/')?.filter(Boolean)?.reduce((acc, curr, index) => {
		if (index === 0) {
			acc[`item_category`] = curr
		} else {
			acc[`item_category${index + 1}`] = curr
		}
		return acc
	}, {})
	
	let price = _item?.price || 0
	if (Array.isArray(_item?.sellers) && _item?.sellers[0]?.Price) {
		price = _item.sellers[0].Price
	} else if (Array.isArray(_item?.sellers) && _item?.sellers[0]?.commertialOffer?.Price) {
		price = _item.sellers[0].commertialOffer.Price
	}

	const variant = _item?.variations?.map(i => i.values?.join(','))?.join('-')
	
	const items = [
		{
			item_id: _item?.itemId || product.productId || '',
			item_name: _item?.nameComplete || _item?.name || product.productName || '',
			item_brand: product.brand || '',
			item_variant: variant || '',
			...categories,
			price: quantity ? price * quantity : price,
			...(quantity && { quantity }),
			...(itemListId && { item_list_id: itemListId }),
			...(itemListName && { item_list_name: itemListName })
		}
	]

	return items
}
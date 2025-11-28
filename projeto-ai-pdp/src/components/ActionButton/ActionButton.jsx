import { CustomButton } from "projeto-ai-shared";
import { useTranslation } from "eitri-i18n";
import { useLocalShoppingCart } from "../../providers/LocalCart";
import { openCart } from "../../services/NavigationService";
import { Icon, Text, Touchable, View } from 'eitri-luminus';
import iconCart from '../../assets/images/cart-01.svg';
import { useState } from 'react';
import iconAdd from '../../assets/images/icon-add.svg';
import iconRemove from '../../assets/images/icon-remove.svg';
import { formatAmount } from "../../utils/utils";

export default function ActionButton(props) {

  const { addItem, cart } = useLocalShoppingCart();
  const { t, i18n } = useTranslation();
  const { currentSku, onPress } = props;
  const [quantity, setQuantity] = useState(1);
  const quantityAvailable = currentSku?.sellers[0]?.commertialOffer?.AvailableQuantity || 0;
  const isAvailable =
    currentSku?.sellers[0]?.commertialOffer?.AvailableQuantity > 0;

  const [isLoading, setLoading] = useState(false);

  const handleButtonAddClick = () => {
    if (quantity < quantityAvailable) {
      setQuantity(quantity + 1);
    }
  }

  const handleButtonRemoveClick = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      return;
    }
  }
  const isItemOnCart = () => {
    return cart?.items?.some((cartItem) => cartItem.id === currentSku?.itemId);
  };


  const handleButtonClick = () => {
    if (!isAvailable) return;
    onPress(quantity);
    quantity > 1 && setQuantity(1);

    // setLoading(true)
    // if (isItemOnCart()) {
    //     openCart()
    // } else {
    //     addItem(currentSku)
    // }

    // setLoading(false)
  };

  return (
    <View
      display='flex'
      paddingHorizontal='large'
      alignItems='center'
      maxWidth='100%'
      gap={16}
      justifyContent='center'
      backgroundColor='primary-900'
      padding='medium'
    >
      <View
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='center'
        gap={22}
        backgroundColor='primary-300'
        borderRadius='micro'
        paddingHorizontal='big'
        height={50}
      >
        <Touchable
          onPress={handleButtonRemoveClick}
        >
          <Image src={iconRemove} width="24px" height="24px" />
        </Touchable>
        <Text
          fontSize='extra-large'
          fontWeight='bold'
          display='flex'
          alignItems='center'
          justifyContent='center'
          marginVertical='small'
          width={16}
          textAlign='center'
        >
          {quantity}
        </Text>
        <Touchable
          onPress={handleButtonAddClick}
        >
          <Image src={iconAdd} width="24px" height="24px" />
        </Touchable>
      </View>
      <Touchable
        onPress={handleButtonClick}
        display='flex'
        height={50}
        width={'100%'}
        maxWidth='100%'
        backgroundColor={isAvailable ? 'secondary-500' : 'neutral-300'}
        justifyContent='center'
        alignItems='center'
        flexDirection='row'
        gap={8}
        borderRadius={'micro'}
      >
        <Image src={iconCart} width="24px" height="24px" />
        <Text
          fontSize='medium'
          fontWeight='bold'
          display='flex'
          alignItems='center'
          justifyContent='center'
          textTransform='uppercase'
        >
          {t('product.labelAddToCart')}
        </Text>
      </Touchable>
      {/* <CustomButton
                label={t('product.labelAddToCart')}
                onPress={handleButtonClick}
                isLoading={isLoading}
                backgroundColor={isAvailable ? 'secondary-500' : 'neutral-300'}
                borderRadius='small'
            /> */}
    </View>
  )
}

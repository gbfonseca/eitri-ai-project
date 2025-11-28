
export default function AddedToCartModal(props) {
  const { onClose, onPressOpenCart, onPressKeepShopping, showModal } = props

  return (
    <>
      <Modal
        onClose={onClose}
        show={showModal}
        position="bottom"
        bottomInset
        bottom={24}
      >
        <View
          direction="column"
          alignItems="center"
          gap={12}
          width="100vw"
          padding="large"
          backgroundColor="neutral-900"
          borderRadiusLeftTop="medium"
          borderRadiusRightTop="medium"
        >
          <Text color="accent-100" fontWeight="bold" fontSize="medium">
            Produto adicionado ao carrinho
          </Text>

          <View
            height="1px"
            width="100%"
            backgroundColor="neutral-500"
            marginBottom="small"
          />

          <CustomButton
            width="100%"
            label={"IR PARA O CARRINHO"}
            onPress={onPressOpenCart}
          />
          <CustomButton
            width="100%"
            variant="outlined"
            label={"CONTINUAR COMPRANDO"}
            onPress={onPressKeepShopping}
          />
        </View>
        <View position="relative" bottomInset />
      </Modal>
    </>
  )
}

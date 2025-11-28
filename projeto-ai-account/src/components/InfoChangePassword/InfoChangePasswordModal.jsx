import { CustomButton } from 'projeto-ai-shared'
import dubleCheckedIcon from '../../assets/icons/duble-checked-icon.svg'

export default function InfoChangePasswordModal(props) {
  const { onClose, onPress, showModal } = props

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
          justifyContent="between"
          gap={12}
          width="100vw"
          height="250px"
          padding="large"
          backgroundColor="primary-300"
        >
          <View direction="column" alignItems="center" gap={12}>
            <View
              marginBottom="small"
              marginTop="small"
            >
              <Image
                src={dubleCheckedIcon}
              />
            </View>
            <Text fontWeight="bold" fontSize="medium">
              Senha alterada com sucesso!
            </Text>

            <Text color="neutral-300" fontSize="small">
              Sua nova senha foi alterada
            </Text>
          </View>

          <CustomButton
            width="100%"
            label={"CONTINUAR"}
            onPress={onPress}
          />
        </View>
        <View position="relative" bottomInset />
      </Modal>
    </>
  )
}

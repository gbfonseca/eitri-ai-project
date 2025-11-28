import { Spacing, Divisor } from 'projeto-ai-shared'
import { useTranslation } from 'eitri-i18n'

export default function Supplier(props) {

    const { supplier } = props;

    const [collapsed, setCollapsed] = useState(true)

    const { t } = useTranslation()

    const toggleCollapsedState = () => {
        setCollapsed(!collapsed)
    }

    return (
        <View>
            <Touchable onPress={() => toggleCollapsedState()}>
                <View display='flex' alignItems='center' justifyContent='between' width='100%'>
                    <Text color='accent-100' fontSize='large' fontWeight='bold'>{t('supplier.txtSupplier')}</Text>
                    <Icon 
                        color={collapsed ? 'secondary-500' : 'accent-100'}
                        iconKey={collapsed ? 'chevron-down' : 'chevron-up'} 
                        width={26} 
                    />
                </View>
            </Touchable>
            {!collapsed &&
                <View>
                    <Text color='accent-100'>{supplier}</Text>
                    <Spacing 
                        height='20px' />
                </View>
            }
            <Divisor
                backgroundColor='secondary-500'
            />
        </View>
    )
}

import React, { useState } from 'react'
import { CustomButton, HeaderContentWrapper, HeaderReturn, HeaderText, ToggleButton } from 'projeto-ai-shared'
import { useTranslation } from 'eitri-i18n';
import iconLogout from '../assets/icons/logout-icon.svg';
import { navigate, PAGES } from "../services/NavigationService";
import Eitri from 'eitri-bifrost'

export default function Settings() {
  const { t } = useTranslation();

  const _doLogout = async () => {
    setIsLoading(true);
    await doLogout();
    navigate(PAGES.SPLASHSCREEN, { redirectTo: "Home" }, true);
    setIsLoading(false);
  };

  const NavigationItem = (props) => {
    const { title, onPress } = props;

    return (
      <Touchable
        backgroundColor="primary-100"
        display="flex"
        direction="row"
        justifyContent="between"
        alignItems="center"
        elevation="low"
        padding="large"
        width="100%"
        height="56px"
        onPress={onPress}
        {...props}
      >
        <Text fontWeight="bold" fontSize="medium">
          {t(title)}
        </Text>

        <Icon
          iconKey='chevron-right'
          color="secondary-500"
          width={24}
          height={24}
        />
      </Touchable>
    )
  }

  const handleAutoplayVideos = () => {
    console.log('handleAutoplayVideos')
  }

  const handleLightMode = () => {
    console.log('handleLightMode')
  }

  return (
    <Window bottomInset topInset title={'teste'}>
      <HeaderContentWrapper
        borderBottomWidth='hairline'
        borderColor="primary-100"
      >
        <HeaderReturn iconColor="secondary-500" />
        <HeaderText
          text={"CONFIGURAÇÕES"}
          marginHorizontal="large"
        />
      </HeaderContentWrapper>
      <View padding="large">
        <View marginBottom="giant">
          <NavigationItem
            title="settings.menuItens.personalInformation.name"
            onPress={() => navigate(PAGES.EDIT_PROFILE)}
          />
        </View>
        <View marginBottom="large">
          <Text
            marginBottom="small"
            fontWeight="bold"
            fontSize="large"
          >
            {t("settings.appConfiguration")}
          </Text>
          <NavigationItem
            title="settings.menuItens.notification.name"
            onPress={() => navigate(PAGES.NOTIFICATIONS)}
          />
          <View
            backgroundColor="primary-100"
            borderTopWidth='hairline'
            borderColor="primary-300"
            elevation="low"
            padding="large"
            width="100%"
            marginBottom="giant"
          >
            <View
              display="flex"
              direction="row"
              justifyContent="between"
              marginBottom="giant"
            >
              <View width="240px">
                <Text
                  fontWeight="bold"
                  fontSize="14px"
                  marginBottom="small"
                >
                  {t("settings.repplayVideos.name")}
                </Text>
                <Text
                  fontSize="10px"
                >
                  {t("settings.repplayVideos.description")}
                </Text>
              </View>
              <View>
                <ToggleButton onPress={handleAutoplayVideos} />
              </View>
            </View>

            <View
              display="flex"
              direction="row"
              justifyContent="between"
            >
              <View>
                <Text
                  fontWeight="bold"
                  fontSize="14px"
                  marginBottom="small"
                >
                  {t("settings.menuItens.lightMode.name")}
                </Text>
              </View>
              <View>
                <ToggleButton onPress={handleLightMode} />
              </View>
            </View>
          </View>

          <Text
            marginBottom="small"
            fontWeight="bold"
            fontSize="large"
          >
            {t("settings.aboutUs")}
          </Text>
          <NavigationItem
            title="settings.menuItens.termsConditions.name"
            onPress={() => Eitri.openBrowser({ url: "https://www.blackskullusa.com.br/institucional/trocas-e-devolucoes", inApp: false })}
            borderBottomWidth='hairline'
            borderColor="primary-300"
          />
          <NavigationItem
            title="settings.menuItens.policy.name"
            onPress={() => Eitri.openBrowser({ url: "https://www.blackskullusa.com.br/institucional/politica-de-privacidade", inApp: false })}
          />
        </View>

        <View>
          <CustomButton
            label={t("home.labelLeave")}
            icon={iconLogout}
            justifyContent="between"
            paddingHorizontal="large"
            onPress={_doLogout}
          />
        </View>
      </View>
    </Window>
  )
}

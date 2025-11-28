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

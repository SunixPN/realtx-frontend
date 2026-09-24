export { default } from './phone-signin-feature';
// Переиспользуются в профиле для привязки номера (тот же Firebase-флоу, другой финальный запрос)
export { default as PhoneStepForm } from './_ui/phone-step-form/phone-step-form';
export { default as CodeStepForm } from './_ui/code-step-form/code-step-form';
export { useRecaptcha } from './_hooks/use-recaptcha';
export { maskPhone } from './_lib/mask-phone';

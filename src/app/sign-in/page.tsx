import SignInFeature from "@/features/sign-in-feature/sign-in-feature";
import GoogleAuthButtonFeature from "@/features/google-auth-button-feature/google-auth-button-feature";
import PhoneAuthButtonFeature from "@/features/phone-auth-button-feature/phone-auth-button-feature";
export default function SignInPage() {
    return (
        <SignInFeature
            googleOAuth={<GoogleAuthButtonFeature />}
            phoneOAuth={<PhoneAuthButtonFeature />}
        />
    )
}
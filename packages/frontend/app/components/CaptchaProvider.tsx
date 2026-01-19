'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface Props {
    children: React.ReactNode;
}

export default function CaptchaProvider({ children }: Props) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
        console.warn('Google reCAPTCHA site key is missing. Captcha will not be active.');
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
                nonce: undefined,
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}

import * as React from 'react';
import { Html } from '@react-email/html';
import {
    Body,
    Head,
    Heading,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';


export type VerificationTemplateProps = {
    domain: string;
    token: string;
}

export const VerificationTemplate = function (props: VerificationTemplateProps) {
    const { domain, token } = props;
    const verificationLink  = `${ domain }/account/verify?token=${ token }`;

    return (
        <Html>
            <Head/>
            <Preview>Верификация аккаунта</Preview>
            <Tailwind>
                <Body className={ 'max-w-2xl mx-auto p-6 bg-slate-50' }>
                    <Section className={ 'text-center mb-8' }>
                        <Heading className={ 'text-3xl text-black font-bold' }>
                            Подтверждение вашей почты
                        </Heading>
                        <Text className={ 'text-base text-black' }>
                            Спасибо за регистрацию. Чтобы подтвердить вашу почту
                            перейдите по ссылке
                        </Text>
                        <Link href={ verificationLink }
                              className={ 'inline-flex items-center' +
                                  ' justify-center rounded-md text-sm' +
                                  ' font-medium text-white bg-[#18B9AE] px-5' +
                                  ' py-2' }>
                            Подтвердить
                        </Link>
                        <Section className={ 'text-center mt-8' }>
                            <Text className={ 'text-gray-600' }>
                                Если у вас возникли проблемы, обращайтесь в нашу
                                поддержку:
                            </Text>
                            <Link
                                href={ 'mailto:help@gmail.com' }
                                className={ 'text-[#18b9ae] underline' }
                            >
                                help@gmail.com
                            </Link>
                        </Section>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    );
};
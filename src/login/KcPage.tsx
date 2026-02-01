import "./index.css";
import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
//import { twMerge } from "tailwind-merge";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n }}
                                classes={{
                                    ...classes,
                                    kcButtonPrimaryClass: "!w-full !py-3 !text-lg !font-medium !transition-all !rounded-full !cursor-pointer !border-0 !bg-[var(--color-orange)] hover:!bg-[var(--color-orange-dark)] !text-[var(--color-text-primary)]"
                                }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "register.ftl":
                        return (
                            <Register
                                {...{ kcContext, i18n }}
                                classes={{
                                    ...classes,
                                    kcButtonPrimaryClass: "!w-full !py-3 !text-lg !font-medium !transition-all !rounded-full !cursor-pointer !border-0 !bg-[var(--color-orange)] hover:!bg-[var(--color-orange-dark)] !text-[var(--color-text-primary)]"
                                }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-update-password.ftl":
                        return (
                            <LoginUpdatePassword
                                {...{ kcContext, i18n }}
                                classes={{
                                    ...classes,
                                    kcButtonPrimaryClass: "!w-full !py-3 !text-lg !font-medium !transition-all !rounded-full !cursor-pointer !border-0 !bg-[var(--color-orange)] hover:!bg-[var(--color-orange-dark)] !text-[var(--color-text-primary)]"
                                }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-reset-password.ftl":
                        return (
                            <LoginResetPassword
                                {...{ kcContext, i18n }}
                                classes={{
                                    ...classes,
                                    kcButtonPrimaryClass: "!w-full !py-3 !text-lg !font-medium !transition-all !rounded-full !cursor-pointer !border-0 !bg-[var(--color-orange)] hover:!bg-[var(--color-orange-dark)] !text-[var(--color-text-primary)]"
                                }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={{
                                    ...classes,
                                    kcButtonPrimaryClass: "!w-full !py-3 !text-lg !font-medium !transition-all !rounded-full !cursor-pointer !border-0 !bg-[var(--color-orange)] hover:!bg-[var(--color-orange-dark)] !text-[var(--color-text-primary)]",
                                    kcButtonClass: "!w-full !py-3 !text-lg !font-medium !transition-all !rounded-full !cursor-pointer !border-0 !bg-[var(--color-orange)] hover:!bg-[var(--color-orange-dark)] !text-[var(--color-text-primary)]"
                                }}
                                Template={Template}
                                doUseDefaultCss={false}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {
    kcButtonPrimaryClass: "!w-full !py-3 !text-lg !font-medium !transition-all !rounded-full !cursor-pointer !border-0 !bg-[var(--color-orange)] hover:!bg-[var(--color-orange-dark)] !text-[var(--color-text-primary)]",
    /* 
    This is commended out because the same rules are applied in the index.css file
    and applying the tailwind utility classes in the CSS file is recommended over applying them here.
    This is because here you're limited in how precisely you can target the DOM elements and manage the specificity. 
    As you can see here I need to use `!` witch is shorthand for `!important` and this should be avoided if possible.
    In the index.css I can simply use `body.kcBodyClass` or `.kcBodyClass.kcBodyClass` instead of just `.kcBodyClass` 
    to increase the specificity and avoid using `!important`.  
    */
    //kcBodyClass: twMerge(
    //    "!bg-[url(./assets/img/background.jpg)] bg-no-repeat bg-center bg-fixed",
    //    "font-geist"
    //),
    //kcHeaderWrapperClass: twMerge("text-3xl font-bold underline")
} satisfies { [key in ClassKey]?: string };

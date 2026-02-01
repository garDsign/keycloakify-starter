import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, auth } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("emailForgotTitle")}
            displayInfo={false}
        >
            <form
                id="kc-reset-password-form"
                onSubmit={() => {
                    setIsSubmitDisabled(true);
                    return true;
                }}
                action={url.loginAction}
                method="post"
                className="space-y-5"
            >
                <div className="form-group">
                    <label htmlFor="username" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
                        {msg("email")}
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        autoFocus
                        defaultValue={auth?.attemptedUsername ?? ""}
                        aria-label={msgStr("email")}
                    />
                </div>

                <div className="mb-4 text-sm" style={{color: 'var(--color-text-secondary)'}}>
                    {msg("emailInstruction")}
                </div>

                <div className={kcClsx("kcFormGroupClass")} style={{ marginTop: "1.5rem" }}>
                    <div id="kc-form-options" className="mb-4">
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <a href={url.loginUrl} className="text-sm" style={{color: 'var(--color-green-dark)'}}>
                                {msg("backToLogin")}
                            </a>
                        </div>
                    </div>

                    <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                        >
                            {msg("doSubmit")}
                        </button>
                    </div>
                </div>
            </form>
        </Template>
    );
}

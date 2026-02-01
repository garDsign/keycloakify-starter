import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
            displayInfo={false}
        >
            <form
                id="kc-passwd-update-form"
                onSubmit={() => {
                    setIsSubmitDisabled(true);
                    return true;
                }}
                action={url.loginAction}
                method="post"
                className="space-y-5"
            >
                <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue=""
                    autoComplete="username"
                    readOnly
                    style={{ display: "none" }}
                />

                <div className="form-group">
                    <label htmlFor="password-new" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
                        {msg("passwordNew")}
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password-new"
                            name="password-new"
                            autoFocus
                            autoComplete="new-password"
                            aria-label={msgStr("passwordNew")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password-confirm" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
                        {msg("passwordConfirm")}
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswordConfirm ? "text" : "password"}
                            id="password-confirm"
                            name="password-confirm"
                            autoComplete="new-password"
                            aria-label={msgStr("passwordConfirm")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                        >
                            {showPasswordConfirm ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="form-group flex items-center gap-2 mb-4">
                    <input
                        type="checkbox"
                        id="logout-sessions"
                        name="logout-sessions"
                        defaultChecked
                    />
                    <label htmlFor="logout-sessions" className="text-sm cursor-pointer" style={{color: 'var(--color-text-primary)'}}>
                        {msg("logoutOtherSessions")}
                    </label>
                </div>

                <div className={kcClsx("kcFormGroupClass")} style={{ marginTop: "1.5rem" }}>
                    <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                        {isAppInitiatedAction ? (
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitDisabled}
                                >
                                    {msg("doSubmit")}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                            >
                                {msg("doSubmit")}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </Template>
    );
}

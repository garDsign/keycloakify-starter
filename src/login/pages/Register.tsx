import { useState, FormEventHandler, useEffect, useReducer } from "react";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Register(
    props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, messagesPerField, passwordRequired, recaptchaRequired, recaptchaSiteKey, termsAcceptanceRequired, realm } = kcContext;
    const { msg, msgStr } = i18n;

    const profile = kcContext.profile;
    const attributes = profile?.attributesByName || {};
    
    // Fields shown in step 1
    const step1Fields = new Set(['email', 'username', 'password', 'password-confirm']);
    const excludeFromRegistration = new Set([
        'gender',
        'city', 
        'street',
        'address',
        'birthday',
        'phone'
    ]);
    
    // Convert attributesByName to array and get step 2 field names
    const allAttributes = Object.entries(attributes).map(([attrName, attr]) => ({
        attrName,
        ...attr
    }));

    const step2FieldNames = allAttributes
        .filter(attr => !step1Fields.has(attr.attrName))
        .filter(attr => !excludeFromRegistration.has(attr.attrName))
        .map(attr => attr.attrName);

    // Detect if there are errors in step 2 fields and start on step 2
    const hasStep2Errors = step2FieldNames.some(fieldName => 
        messagesPerField.existsError(fieldName)
    );
    const [activeStep, setActiveStep] = useState<1 | 2>(hasStep2Errors ? 2 : 1);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        if (activeStep === 1) {
            e.preventDefault();
            
            // Basic validation for step 1
            const form = e.currentTarget;
            const email = form.email.value;
            const password = form.password?.value;
            const passwordConfirm = form["password-confirm"]?.value;
            
            if (!email || (passwordRequired && (!password || !passwordConfirm))) {
                return;
            }
            
            if (passwordRequired && password !== passwordConfirm) {
                return;
            }
            
            setActiveStep(2);
        }
    };

    // Function to render a dynamic field
    const renderField = (attrName: string) => {
        const attr = attributes[attrName];
        if (!attr) return null;
        
        // Get current language
        const currentLang = kcContext.locale?.currentLanguageTag?.split('-')[0] || 'nl';
        
        // Custom field name translations based on language
        const translations: Record<string, Record<string, string>> = {
            'nl': {
                'house_number': 'Huisnummer',
                'postcode': 'Postcode',
                'zip': 'Postcode',
                'firstName': 'Voornaam',
                'lastName': 'Achternaam',
                'city': 'Stad',
                'street': 'Straat',
                'address': 'Adres',
                'phone': 'Telefoonnummer',
                'gender': 'Geslacht',
                'birthday': 'Geboortedatum',
            },
            'en': {
                'house_number': 'House Number',
                'postcode': 'Postal Code',
                'zip': 'Postal Code',
                'firstName': 'First Name',
                'lastName': 'Last Name',
                'city': 'City',
                'street': 'Street',
                'address': 'Address',
                'phone': 'Phone Number',
                'gender': 'Gender',
                'birthday': 'Date of Birth',
            }
        };
        
        const customFieldNames = translations[currentLang] || translations['en'];
        
        // Get localized display name using i18n message system
        const displayName = (() => {
            // Check custom mappings first
            if (customFieldNames[attrName]) {
                return customFieldNames[attrName];
            }
            
            // Try the attribute name as a message key with type assertion
            try {
                const translatedMsg = msgStr(attrName as any);
                if (translatedMsg && translatedMsg !== attrName) return translatedMsg;
            } catch {
                // Message key doesn't exist, continue to fallback
            }
            
            // Fallback to displayName from attribute if it doesn't contain template strings
            if (attr.displayName && !attr.displayName.includes('${')) {
                return attr.displayName;
            }
            
            // Last resort: format the attribute name nicely
            return attrName
                .split(/[_-]/)
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        })();
        
        const isRequired = attr.required && activeStep === 2;
        const fieldValue = attr.value || "";
        
        // Check if field has options (select/dropdown)
        const hasOptions = attr.validators?.options?.options;
        
        return (
            <div key={attrName} className="form-group mb-5">
                <label 
                    htmlFor={attrName} 
                    className="block text-sm font-medium mb-2" 
                    style={{color: 'var(--color-text-primary)'}}
                >
                    {displayName}
                </label>
                
                {hasOptions ? (
                    <select
                        id={attrName}
                        name={attrName}
                        required={isRequired}
                        defaultValue={fieldValue}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none text-base"
                        style={{ 
                            borderColor: 'var(--color-border)', 
                            backgroundColor: 'var(--color-beige-dark)', 
                            lineHeight: '1.5' 
                        }}
                        aria-invalid={messagesPerField.existsError(attrName)}
                    >
                        <option value="">Select...</option>
                        {(hasOptions as string[]).map(option => (
                            <option key={option} value={option}>
                                {attr.annotations?.inputOptionLabels?.[option] || option}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={attr.annotations?.inputType || "text"}
                        id={attrName}
                        name={attrName}
                        required={isRequired}
                        defaultValue={fieldValue}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none text-base"
                        style={{ 
                            borderColor: 'var(--color-border)', 
                            backgroundColor: 'var(--color-beige-dark)', 
                            lineHeight: '1.5' 
                        }}
                        aria-invalid={messagesPerField.existsError(attrName)}
                    />
                )}
                
                {messagesPerField.existsError(attrName) && (
                    <span 
                        className="text-red-600 text-sm mt-1 block" 
                        dangerouslySetInnerHTML={{ 
                            __html: kcSanitize(messagesPerField.get(attrName)) 
                        }} 
                    />
                )}
            </div>
        );
    };

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayMessage={false}
            displayRequiredFields={false}
            headerNode={"Welkom bij de registratie"}
        >
            <form id="kc-register-form" action={url.registrationAction} method="post" onSubmit={onSubmit} className="space-y-5">
                {/* Step 1: Email and Password */}
                <div className={clsx(activeStep !== 1 && "hidden")}>
                    {/* Username - only show if not using email as username */}
                    {!realm.registrationEmailAsUsername && attributes.username !== undefined && (
                        <div className="form-group mb-5">
                            <label htmlFor="username" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
                                {msg("username")}
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                autoComplete="username"
                                defaultValue={attributes.username?.value || ""}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none text-base"
                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-beige-dark)', lineHeight: '1.5' }}
                                aria-invalid={messagesPerField.existsError("username")}
                            />
                            {messagesPerField.existsError("username") && (
                                <span className="text-red-600 text-sm mt-1 block" dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("username")) }} />
                            )}
                        </div>
                    )}
                    
                    <div className="form-group mb-5">
                        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
                            {msg("email")}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            autoComplete="email"
                            defaultValue={attributes.email?.value || ""}
                            className="w-full px-4 py-3 rounded-lg border focus:outline-none text-base"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-beige-dark)', lineHeight: '1.5' }}
                            aria-invalid={messagesPerField.existsError("email")}
                        />
                        {messagesPerField.existsError("email") && (
                            <span className="text-red-600 text-sm mt-1 block" dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("email")) }} />
                        )}
                    </div>

                    {passwordRequired && (
                        <>
                            <div className="form-group mb-5">
                                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
                                    {msg("password")}
                                </label>
                                <PasswordWrapper i18n={i18n} passwordInputId="password">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                        autoComplete="new-password"
                                        className="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none text-base"
                                        style={{borderColor: 'var(--color-border)', backgroundColor: 'var(--color-beige-dark)', lineHeight: '1.5'}}
                                        aria-invalid={messagesPerField.existsError("password")}
                                    />
                                </PasswordWrapper>
                                {messagesPerField.existsError("password") && (
                                    <span className="text-red-600 text-sm mt-1 block" dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password")) }} />
                                )}
                            </div>

                            <div className="form-group mb-5">
                                <label htmlFor="password-confirm" className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-primary)'}}>
                                    {msg("passwordConfirm")}
                                </label>
                                <PasswordWrapper i18n={i18n} passwordInputId="password-confirm">
                                    <input
                                        type="password"
                                        id="password-confirm"
                                        name="password-confirm"
                                        required
                                        autoComplete="new-password"
                                        className="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none text-base"
                                        style={{borderColor: 'var(--color-border)', backgroundColor: 'var(--color-beige-dark)', lineHeight: '1.5'}}
                                        aria-invalid={messagesPerField.existsError("password-confirm")}
                                    />
                                </PasswordWrapper>
                                {messagesPerField.existsError("password-confirm") && (
                                    <span className="text-red-600 text-sm mt-1 block" dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password-confirm")) }} />
                                )}
                            </div>
                        </>
                    )}

                    <div className="pt-1">
                        <button type="submit" className="w-full py-3 px-4 text-lg font-medium transition-colors" style={{backgroundColor: 'var(--color-orange)', borderRadius: '100px', color: 'var(--color-text-primary)'}}>
                            {msg("doContinue")}
                        </button>
                    </div>

                    <div className="text-sm mt-4" style={{color: 'var(--color-text-primary)'}}>
                        <a href={url.loginUrl} className="underline keep-underline-on-hover" style={{color: 'var(--color-text-primary)'}}>
                            {msg("backToLogin")}
                        </a>
                    </div>
                </div>

                {/* Step 2: Dynamic fields from profile */}
                <div className={clsx(activeStep !== 2 && "hidden")}>
                    {allAttributes
                        .filter(attr => !step1Fields.has(attr.attrName))
                        .filter(attr => !excludeFromRegistration.has(attr.attrName))
                        .map(attr => renderField(attr.attrName))
                    }

                    {termsAcceptanceRequired && (
                        <div className="form-group mb-5">
                            <div className="flex items-start">
                                <input type="checkbox" id="termsAccepted" name="termsAccepted" required className="mt-1 mr-2" aria-invalid={messagesPerField.existsError("termsAccepted")} />
                                <label htmlFor="termsAccepted" className="text-sm" style={{color: 'var(--color-text-primary)'}}>
                                    <span dangerouslySetInnerHTML={{ __html: msg("termsText") }} />
                                </label>
                            </div>
                            {messagesPerField.existsError("termsAccepted") && (
                                <span className="text-red-600 text-sm mt-1 block" dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("termsAccepted")) }} />
                            )}
                        </div>
                    )}

                    {recaptchaRequired && (
                        <div className="form-group mb-5">
                            <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
                        </div>
                    )}

                    <div className="pt-1">
                        <button type="submit" className="w-full py-3 px-4 text-lg font-medium transition-colors mb-3" style={{backgroundColor: 'var(--color-orange)', borderRadius: '100px', color: 'var(--color-text-primary)'}}>
                            {msg("doRegister")}
                        </button>
                        <button type="button" onClick={() => setActiveStep(1)} className="w-full py-3 px-4 text-lg font-medium transition-colors border" style={{borderRadius: '100px', borderColor: 'var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-primary)'}}>
                            {msg("doBack")}
                        </button>
                    </div>
                </div>
            </form>
        </Template>
    );
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { i18n, passwordInputId, children } = props;
    const { msgStr } = i18n;
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);
        assert(passwordInputElement instanceof HTMLInputElement);
        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed, passwordInputId]);

    return (
        <div className="relative">
            {children}
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{color: 'var(--color-green-dark)'}} aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")} onClick={toggleIsPasswordRevealed}>
                {isPasswordRevealed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
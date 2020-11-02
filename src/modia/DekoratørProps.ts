export interface TogglesConfig {
    visVeileder?: boolean;
}

export interface Markup {
    etterSokefelt?: string;
}

export interface Contextvalue<T> {
    initialValue: string | null;
    display: T;
    onChange(value: string | null): void;
    skipModal?: boolean;
    ignoreWsEvents?: boolean;
}

export enum EnhetDisplay {
    ENHET = 'ENHET',
    ENHET_VALG = 'ENHET_VALG',
}

export enum FnrDisplay {
    SOKEFELT = 'SOKEFELT',
}

export type EnhetContextvalue = Contextvalue<EnhetDisplay>;
export type FnrContextvalue = Contextvalue<FnrDisplay>;

interface DekoratørProps {
    appname: string;
    fnr?: FnrContextvalue;
    enhet?: EnhetContextvalue;
    toggles?: TogglesConfig;
    markup?: Markup;
}

export default DekoratørProps;

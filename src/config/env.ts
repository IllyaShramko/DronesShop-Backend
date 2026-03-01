import { cleanEnv, str } from "envalid"

export const ENV = cleanEnv(process.env,{
    JWT_ACCESS_SECRET_KEY: str(),
    JWT_EXPIRES_IN: str(),
    HOST_EMAIL_ADDRESS: str(),
    HOST_EMAIL_PASSWORD: str(),
    CONTACT_EMAIL: str(),
    NOVAPOSHTA_API_KEY: str(),
    NOVAPOSHTA_SENDER_REF: str(),
    NOVAPOSHTA_SENDER_CONTACT_REF: str(),
    SENDER_PHONE: str()
})
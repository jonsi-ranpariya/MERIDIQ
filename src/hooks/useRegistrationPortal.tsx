import { useContext } from "react";
import { RegistrationPortalContext } from "../components/RegistrationPortal/RegistrationPortalWizard";

export default function useRegistrationPortal() {
    const context = useContext(RegistrationPortalContext);

    return context;
}
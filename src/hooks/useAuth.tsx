import { AuthContext } from "@provider/AuthProvider";
import { useContext } from "react";

export default function useAuth() {
    return useContext(AuthContext)
}
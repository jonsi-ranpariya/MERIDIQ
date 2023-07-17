import { useContext } from "react";
import { LoadingContext } from "../provider/LoadingProvider";

export default function useLoading() {
    const context = useContext(LoadingContext);

    return context;
}
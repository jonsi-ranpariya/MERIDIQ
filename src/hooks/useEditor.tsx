import { useContext } from "react";
import { EditingContext } from "../provider/EditingProvider";

export default function useEditor() {
  const context = useContext(EditingContext);

  return context;
}
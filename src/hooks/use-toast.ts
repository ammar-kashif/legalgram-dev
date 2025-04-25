
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

export const useToast = useToastOriginal;
export const toast = useToastOriginal().toast;

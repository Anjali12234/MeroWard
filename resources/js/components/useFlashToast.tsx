import { useEffect, useRef } from "react"
import { usePage } from "@inertiajs/react"
import toast from "react-hot-toast"

export default function useFlashToast() {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string }
    }

    const shownRef = useRef<{ success?: string; error?: string }>({})

    useEffect(() => {
        if (flash?.success && shownRef.current.success !== flash.success) {
            toast.success(flash.success)
            shownRef.current.success = flash.success
        }

        if (flash?.error && shownRef.current.error !== flash.error) {
            toast.error(flash.error)
            shownRef.current.error = flash.error
        }
    }, [flash])
}

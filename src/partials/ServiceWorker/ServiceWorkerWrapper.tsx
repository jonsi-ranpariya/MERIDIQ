import React, { FC, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import useLocalStorage from '../../hooks/useLocalStorage';
import strings from '../../lang/Lang';
import * as serviceWorker from '../../serviceWorkerRegistration';

const ServiceWorkerWrapper: FC = () => {
    const { storedValue: showReload, setStorageValue: setShowReload } = useLocalStorage('hasUpdate', false);
    const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null);

    const [online, setOnline] = React.useState(navigator.onLine);

    const noInternetToastId = React.useRef<number | string>();
    const updateAvailableId = React.useRef<number | string>();

    const onSWUpdate = (registration: ServiceWorkerRegistration) => {
        setShowReload(true);
        setWaitingWorker(registration.waiting);
    };
    function changeOnline() {
        setOnline(navigator.onLine)
    }

    useEffect(() => {
        serviceWorker.register({ onUpdate: onSWUpdate })
        window.addEventListener('online', changeOnline)
        window.addEventListener('offline', changeOnline)
        return () => {
            window.removeEventListener('online', changeOnline)
            window.removeEventListener('offline', changeOnline)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reloadPage = () => {
        waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
        setShowReload(false);
        setTimeout(() => window.location.reload(), 300);
    };

    useEffect(() => {
        if (!online) {
            noInternetToast()
        } else {
            noInternetToastDismiss()
        }
    }, [online])

    useEffect(() => {
        if (showReload) {
            updateAvailableToast()
        } else {
            updateAvailableDismiss()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showReload])

    const updateAvailableToast = useCallback(() => {
        updateAvailableId.current = toast(strings.NewUpdate, {
            autoClose: false,
            closeOnClick: false,
            type: 'success',
            icon: <></>,
            onClick: reloadPage,
            closeButton: false,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    function noInternetToast() {
        noInternetToastId.current = toast(strings.NoInternet, {
            autoClose: false,
            closeOnClick: false,
            type: 'error',
            closeButton: false,
        })
    }

    function noInternetToastDismiss() {
        if (noInternetToastId.current) toast.dismiss(noInternetToastId.current)
    }
    function updateAvailableDismiss() {
        if (updateAvailableId.current) toast.dismiss(updateAvailableId.current)
    }

    return <></>;
}

export default ServiceWorkerWrapper;
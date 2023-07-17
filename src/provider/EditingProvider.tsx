import React, { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useNavigate, useParams } from 'react-router-dom';
import { calculateAspectRatioFit } from '../components/Clients/Client/BeforeAfterImage/helpers/image';
import { useWindowSize } from '../hooks/useWindowSize';

export type AspectRatio = '1/1' | '16/9'

interface EditingProps {
  children?: React.ReactNode,
}

interface WrapperSize {
  width: number
  height: number
}

export const EditingContext = createContext<{
  beforeImage?: File | Blob
  setBeforeImage: Dispatch<SetStateAction<File | Blob | undefined>>

  afterImage?: File | Blob
  setAfterImage: Dispatch<SetStateAction<File | Blob | undefined>>

  aspectRatio: AspectRatio,
  setAspectRatio: Dispatch<SetStateAction<AspectRatio>>

  wrapperSize: WrapperSize
  fullscreen: boolean

}>({
  setBeforeImage: () => {},
  setAfterImage: () => {},
  aspectRatio: '1/1',
  setAspectRatio: () => {},
  fullscreen: false,
  wrapperSize: {
    height: 0,
    width: 0,
  }
});

const sm = 640
// const md = 768
// const lg = 1024
// const xl = 1280

export const EditingProvider: React.FC<EditingProps> = ({ children }) => {

  const navigate = useNavigate()
  const location = useLocation()
  const currentRoute = location.pathname;
  const { clientId }: { clientId?: string } = useParams();

  const [beforeImage, setBeforeImage] = useState<File | Blob>();
  const [afterImage, setAfterImage] = useState<File | Blob>();
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1/1');
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const beforeEditor = currentRoute.includes('/before') && currentRoute.includes('editor');
    const afterEditor = currentRoute.includes('/after') && currentRoute.includes('editor');

    if (beforeEditor && !beforeImage) {
      navigate(`/clients/${clientId}/before-after`, { replace: true }); return;
    }
    if (afterEditor && !afterImage && !beforeImage) {
      navigate(`/clients/${clientId}/before-after`, { replace: true }); return;
    }
    if (currentRoute.includes('/after') && !beforeImage) {
      navigate(`/clients/${clientId}/before-after/before/select`, { replace: true }); return;
    }
    if (afterEditor && !afterImage) {
      navigate(`/clients/${clientId}/before-after/after/select`, { replace: true }); return;
    }
    if (currentRoute.includes('download') && !afterImage && !beforeImage) {
      navigate(`/clients/${clientId}/before-after`, { replace: true }); return;
    }
  }, [afterImage, beforeImage, clientId, currentRoute, navigate])

  const size = useWindowSize();

  useEffect(() => {
    const listener = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', listener)
    return () => document.removeEventListener('fullscreenchange', listener)
  }, [])

  const spacing = useMemo(() => {
    let padding = 220;
    if (fullscreen) return 0;
    if (!size.width) return padding;
    if (size.width < sm) padding = 20
    return padding;
  }, [fullscreen, size.width]);

  const wrapperSize = useMemo(() => {

    const aspec = aspectRatio.split('/');
    const maxWidth = (size.width ?? 0) - spacing;
    const maxHeight = (size.height ?? 0) - spacing;

    return calculateAspectRatioFit(parseInt(aspec[0]), parseInt(aspec[1]), maxWidth, maxHeight)
  }, [aspectRatio, size.height, size.width, spacing])

  return (
    <EditingContext.Provider value={{
      beforeImage,
      setBeforeImage,
      afterImage,
      setAfterImage,
      aspectRatio,
      setAspectRatio,
      wrapperSize,
      fullscreen,
    }}>
      {children}
    </EditingContext.Provider>
  );
}

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';
import strings from '../../lang/Lang';
import TinyError from '../Error/TinyError';

export interface MaterialSignturePadProps {
    onClear?: () => void,
    onEnd?: () => void,
    error?: boolean
    helperText?: string | false
}

const MaterialSignturePad = forwardRef(({
    onClear = () => {},
    onEnd = () => {},
    error = false,
    helperText = "",
}: MaterialSignturePadProps, ref) => {

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

    const sigPad = useRef<SignaturePad | null>(null);

    useImperativeHandle(ref, () => sigPad.current as SignaturePad);

    // copied from https://github.com/szimek/signature_pad/issues/638#issuecomment-1222608911
    // When the canvas element mounts, store the signature pad and canvas.
    const canvasCallback = useCallback((canvasNode: HTMLCanvasElement) => {
        if (canvasNode === null) return;
        setCanvas(canvasNode);
        const sp = new SignaturePad(canvasNode);
        sigPad.current = sp;
        sigPad.current.addEventListener("endStroke", onEnd)
        return () => {
            sigPad.current?.removeEventListener("endStroke", onEnd)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Resize canvas immediately and on window resize so the canvas size matches
    // the display size. Otherwise, the cursor position will not match where
    // lines appear on the canvas.
    useEffect(() => {
        if (!canvas || !sigPad.current) return;
        const resize = () => { if (sigPad.current) { resizeCanvas(canvas, sigPad.current); } }
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [canvas, sigPad]);

    return (
        <div className="">
            <div className="w-full relative">
                <canvas
                    ref={canvasCallback}
                    className="w-full h-56 cursor-draw border dark:bg-white rounded"
                />
                <button
                    onClick={onClear}
                    className="absolute hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 px-1 outline-none rounded text-black top-1 right-1 z-10"
                >
                    {strings.Clear}
                </button>
            </div>
            <TinyError
                error={error}
                helperText={helperText}
            />
        </div>
    );
});

// copied from https://github.com/szimek/signature_pad/issues/638#issuecomment-1222608911
/** Resizes a canvas to match the display size. */
const resizeCanvas = (canvas: HTMLCanvasElement, sigPad: SignaturePad) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const ratio = Math.max(window.devicePixelRatio ?? 1, 1);
    // eslint-disable-next-line no-param-reassign
    canvas.width = canvas.offsetWidth * ratio;
    // eslint-disable-next-line no-param-reassign
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);
    sigPad.clear(); // otherwise, isEmpty() might return incorrect value
};

export default MaterialSignturePad;
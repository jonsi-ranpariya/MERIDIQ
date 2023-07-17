
export function LinearProgressWithLabel(props: { value: number }) {
    const percent = Math.round(props.value);
    return (
        <div className="flex flex-col justify-center items-center space-y-2">
            <span className="flex w-full items-center justify-between pointer-events-none overflow-hidden rounded-lg bg-primary/25">
                <span className="bg-primary h-2 transition-all rounded-full" style={{ width: `${percent}%` }} />
            </span>
            <p>{`${percent}%`}</p>
        </div>
    );
}
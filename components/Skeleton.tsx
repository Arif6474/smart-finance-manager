export default function Skeleton({
    className = '',
    ...props
}: {
    className?: string;
    [key: string]: any;
}) {
    return (
        <div
            className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
            {...props}
        />
    );
}

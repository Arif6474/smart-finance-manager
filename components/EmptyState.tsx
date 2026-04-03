import { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export default function EmptyState({
    title,
    description,
    icon = <PackageOpen size={48} className="text-slate-400 dark:text-slate-500 mb-4 stroke-[1.5]" />,
    action
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl glass w-full">
            {icon}
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">{description}</p>
            {action}
        </div>
    );
}

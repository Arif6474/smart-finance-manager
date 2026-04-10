'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoToUpgrade() {
    const router = useRouter();

    useEffect(() => {
        router.push('/upgrade');
    }, [router]);

    return null;
}

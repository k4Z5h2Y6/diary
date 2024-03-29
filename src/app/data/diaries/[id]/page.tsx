'use client';

import { usePathname } from 'next/navigation';

export default function Page() {
	const Pathname = usePathname();
	return <h1 className="text-3xl font-bold">パス: {Pathname}</h1>;
}

'use client';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-secondary">
            <main>
                {children}
            </main>
        </div>
    );
}

    
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

const EmptyDashboard: React.FC = () => {
    const t = useTranslations('Movie');

    return (
        <div className="flex flex-col justify-center items-center px-6 py-64 lg:px-8">
            <div className="text-center mb-6 md:mb-10">
                <h2 className="heading-two">
                    {t('Your movie list is empty')}
                </h2>
            </div>
            <div className="mt-6 md:mt-10 w-full md:w-auto">
                <Link
                    href="/add"
                    className="flex w-full md:w-auto justify-center rounded-md bg-primary text-white px-6 py-3 text-base font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition"
                    aria-label={t('Add a new movie')}
                >
                    {t('Add a new movie')}
                </Link>
            </div>
        </div>
    );
};

// Wrapping with React.memo for performance optimization
const MemoizedEmptyDashboard = React.memo(EmptyDashboard);

// Assigning a displayName for better debugging and readability in React DevTools
MemoizedEmptyDashboard.displayName = 'EmptyDashboard';

export default MemoizedEmptyDashboard;

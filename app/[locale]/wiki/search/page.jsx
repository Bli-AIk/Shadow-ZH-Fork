import { Suspense } from 'react';
import SearchPageContent from 'components/SearchPageContent';

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SearchPageContent />
        </Suspense>
    );
}

// TODO: Do this more natively in Remix
import type { PropsWithChildren } from 'react';

export function PageTitle({ children }: PropsWithChildren) {
    return <h2 className="text-2xl mb-4 capitalize">{children}</h2>
}

export default PageTitle;
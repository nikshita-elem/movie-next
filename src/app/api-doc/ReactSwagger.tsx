'use client';

import 'swagger-ui-react/swagger-ui.css'
import dynamic from 'next/dynamic';
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });


type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spec: Record<string, any>,
}

function ReactSwagger({ spec }: Props) {
    return (
        <div>
            <SwaggerUI spec={spec} />
        </div>
    )
}

export default ReactSwagger
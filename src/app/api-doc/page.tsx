import { getApiDocs } from '@/libs/swagger';
import ReactSwagger from './ReactSwagger';


export default async function page() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spec: Record<string, any> = await getApiDocs();
    return (
        <section className=''>
            <ReactSwagger spec={spec} />
        </section>
    )
}

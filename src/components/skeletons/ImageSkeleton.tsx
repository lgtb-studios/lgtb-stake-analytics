import { Loader } from 'lucide-react';

export function ImageSkeleton({ style }: { style: string }) {

    return (

        <Loader className={style} />

    );
} 
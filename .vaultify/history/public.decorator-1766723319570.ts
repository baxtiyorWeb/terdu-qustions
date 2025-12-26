import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// `@Public()` dekoratori bu endpointni Guarddan istisno qilishini belgilaydi.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

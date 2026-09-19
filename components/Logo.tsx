import { cn } from '@/lib/utils';
import Image from 'next/image';

const Logo = ({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) => {
  return (
    <Image
      src="/icons/logo.png"
      alt="Horizon"
      width={size}
      height={Math.round(size * 0.75)}
      className={cn('rounded-md object-contain', className)}
      priority
    />
  );
};

export default Logo;

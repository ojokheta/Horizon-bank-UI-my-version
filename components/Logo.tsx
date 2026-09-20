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
      src="/logo.png"
      alt="Horizon"
      width={size}
      height={size}
      className={cn('rounded-md object-contain', className)}
      priority
    />
  );
};

export default Logo;

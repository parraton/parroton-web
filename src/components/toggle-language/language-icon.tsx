import { Language } from '@i18n/settings';
import { Avatar, AvatarFallback } from '@UI/avatar';

export function LanguageIcon({
  code,
  icon,
  className,
}: {
  code: Language;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {/*<AvatarImage src='https://github.com/shadcn.png' alt='code' />*/}
      <Avatar asChild>{icon}</Avatar>
      <AvatarFallback>{code}</AvatarFallback>
    </Avatar>
  );
}

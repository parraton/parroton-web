import { RewardsBody } from './rewards-body';

export { generateFallbackMetadata as generateMetadata } from '@routes/generate-fallback-metadata';

export default function Rewards() {
  return (
    <div className='custom-wrapper flex w-full justify-center'>
      <div className='flex max-w-md flex-col gap-2 md:gap-4'>
        <RewardsBody />
      </div>
    </div>
  );
}

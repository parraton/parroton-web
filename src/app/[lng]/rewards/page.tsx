import { RewardsBody } from './rewards-body';

export { generateFallbackMetadata as generateMetadata } from '@routes/generate-fallback-metadata';

export default function Rewards() {
  return (
    <div className='custom-wrapper flex w-full flex-col justify-center gap-5'>
      <RewardsBody />
    </div>
  );
}

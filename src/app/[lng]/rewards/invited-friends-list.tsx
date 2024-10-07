import React, { useCallback } from 'react';
import { InvitedFriendProps } from '@hooks/use-points-sources';
import { useTranslation } from '@i18n/client';
import { OrLoader } from '@components/loader/loader';
import { ButtonV2 } from '@UI/button-v2';
import { GlassCard } from '@components/glass-card';

interface InvitedFriendsListProps {
  data: InvitedFriendProps[] | undefined;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  claimRewards: (friendId: string) => void;
}

interface InvitedFriendViewProps {
  friend: InvitedFriendProps;
  // eslint-disable-next-line no-unused-vars
  claimRewards: (friendId: string) => void;
}

const InvitedFriendView = ({ friend, claimRewards }: InvitedFriendViewProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  const handleClaimClick = useCallback(() => claimRewards(friend.id), [claimRewards, friend.id]);

  return (
    <tr>
      <td className='py-1 pr-1'>{friend.name}</td>
      <td className='p-1'>{friend.claimedPoints}</td>
      <td className='p-1'>{friend.pendingPoints}</td>
      <td className='flex justify-end py-1 pl-1'>
        <ButtonV2
          className='text-sm font-extrabold'
          onClick={handleClaimClick}
          disabled={friend.pendingPoints === 0}
        >
          {t('claim')}
        </ButtonV2>
      </td>
    </tr>
  );
};

export const InvitedFriendsList = ({ data, loading, claimRewards }: InvitedFriendsListProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  const renderInvitedFriendsList = useCallback(
    (invitedFriends: InvitedFriendProps[]) =>
      invitedFriends.length === 0 ? (
        <p className='w-full text-left'>{t('no_friends_invited')}</p>
      ) : (
        <table className='w-full font-semibold'>
          <thead>
            <tr>
              <th />
              <th className='px-1 text-left'>{t('claimed')}</th>
              <th className='px-1 text-left'>{t('pending')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invitedFriends.map((friend) => (
              <InvitedFriendView key={friend.id} friend={friend} claimRewards={claimRewards} />
            ))}
          </tbody>
        </table>
      ),
    [claimRewards, t],
  );

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-lg font-medium'>{t('invited_friends')}</p>
      <GlassCard className='flex max-h-28 justify-center overflow-y-auto p-3 text-lg leading-tight md:max-h-none'>
        <OrLoader value={data} animation={loading} modifier={renderInvitedFriendsList} />
      </GlassCard>
    </div>
  );
};

import React, { useCallback } from 'react';
import { InvitedFriendProps } from '../../../hooks/use-points-sources';
import { useTranslation } from '@i18n/client';
import { Button } from '@UI/button';
import { OrLoader } from '@components/loader/loader';

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
      <td className='py-1 pl-1 text-right'>
        <Button onClick={handleClaimClick} disabled={friend.pendingPoints === 0}>
          {t('claim')}
        </Button>
      </td>
    </tr>
  );
};

export const InvitedFriendsList = ({ data, loading, claimRewards }: InvitedFriendsListProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  const renderInvitedFriendsList = useCallback(
    (invitedFriends: InvitedFriendProps[]) =>
      invitedFriends.length === 0 ? (
        t('no_friends_invited')
      ) : (
        <table className='w-full'>
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
    <>
      <p>{t('invited_friends')}</p>
      <div className='max-h-24 overflow-y-auto rounded-lg bg-gray-500 p-3 md:max-h-none'>
        <OrLoader value={data} animation={loading} modifier={renderInvitedFriendsList} />
      </div>
    </>
  );
};

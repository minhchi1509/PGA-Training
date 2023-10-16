import { Popover } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { CloseIcon } from 'src/assets/icons';
import { SearchInput } from 'src/components/input';
import { BaseText } from 'src/components/typography';
import { TGetChatMembersResponse } from 'src/interfaces/chat-interface';
import { TMouseEventSVGHandler } from 'src/interfaces/common-interface';
import { TConversation } from 'src/interfaces/messages-interface';
import { TRootState } from 'src/stores';
import { EChatActions } from 'src/stores/chat';
import ConversationList from './ConversationList';
import './CreateChatHeader.scss';

interface IProps {
  searchedResult?: TGetChatMembersResponse;
  onSearch: (keyword: string) => void;
  onRemoveMember: () => void;
  onClickMember: (member: TConversation) => void;
  onLoadMore: () => void;
}

const CreateChatHeader = ({ searchedResult, onSearch, onClickMember, onLoadMore, onRemoveMember }: IProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<TConversation>();
  const [openPopover, setOpenPopover] = useState(false);

  const { loadingMore } = useSelector((state: TRootState) => ({
    loadingMore: state.loading[EChatActions.LOAD_MORE_CHAT_MEMBERS],
  }));

  const formattedResults: TConversation[] = useMemo(() => {
    return (
      searchedResult?.data?.map((item) => ({
        receiveId: item.id,
        name: `${item.firstName} ${item.lastName}`,
        avatar: item.avatar,
        type: item.type,
        partner: { ...item },
      })) ?? []
    );
  }, [searchedResult?.data]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleClickMember = (data: TConversation) => {
    setSelectedMember(data);
    onClickMember(data);
    setOpenPopover(false);
    setSearchValue('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpenPopover(newOpen);
  };

  const handleRemoveMember = (e: TMouseEventSVGHandler) => {
    e.stopPropagation();
    onRemoveMember();
    setSelectedMember(undefined);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  return (
    <div className="CreateChatHeader">
      <BaseText inline type="body1">
        To:
      </BaseText>
      <Popover
        open={openPopover}
        content={
          <ConversationList
            id="Add New Conversation"
            width={350}
            height={490}
            customScroll
            isSearchAction={true}
            data={formattedResults}
            dataLength={formattedResults?.length ?? 0}
            hasMore={(searchedResult?.currentPage ?? 0) < (searchedResult?.totalPage ?? 0)}
            loadingMore={loadingMore}
            onLoadMore={onLoadMore}
            onClickItem={handleClickMember}
          />
        }
        overlayClassName="CreateChatHeader__options"
        trigger={['click']}
        placement="bottomLeft"
        arrow={false}
        onOpenChange={handleOpenChange}
      >
        <div className="CreateChatHeader__wrapper" onClick={() => setOpenPopover(true)}>
          {selectedMember && (
            <div className="CreateChatHeader__wrapper-selected">
              <BaseText type="caption">{selectedMember.name}</BaseText>
              <CloseIcon className="CreateChatHeader__wrapper-selected-icon" onClick={handleRemoveMember} />
            </div>
          )}
          <SearchInput
            className="CreateChatHeader__input"
            allowClear={false}
            prefix={null}
            placeHolder=""
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </Popover>
    </div>
  );
};

export default CreateChatHeader;

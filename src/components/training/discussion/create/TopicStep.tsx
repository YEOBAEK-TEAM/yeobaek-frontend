import SectionState from "@/components/common/section/SectionState";
import SelectableBookItem from "@/components/training/comprehension/SelectableBookItem";
import StepTitle from "@/components/training/discussion/create/StepTitle";
import EmptyMessage from "@/components/training/discussion/EmptyMessage";
import SearchField from "@/components/training/discussion/shared/SearchField";
import { getTopicSearchEmptyText, TOPIC_STEP } from "@/constants/training/discussion/room";
import { useDebouncedSearchParam } from "@/hooks/training/discussion/useDebouncedSearchParam";
import { useDiscussionTopics } from "@/hooks/training/discussion/useRoomQueries";

import type { DiscussionTopicView } from "@/types/training/discussion/room";

type TopicStepProps = {
  selectedKey: string | null;
  onSelect: (topic: DiscussionTopicView) => void;
};

const RADIO_NAME = "discussion-topic";

const SKELETON_ITEMS = [0, 1, 2];

export default function TopicStep({ selectedKey, onSelect }: TopicStepProps) {
  const { input, setInput, keyword, submit } = useDebouncedSearchParam("q");

  const { data: topics = [], isPending, isError, refetch } = useDiscussionTopics(keyword);

  // 선택 아이템 앞뒤 구분선 숨김
  const isDivided = (index: number) =>
    index < topics.length - 1 &&
    selectedKey !== topics[index].key &&
    selectedKey !== topics[index + 1].key;

  const renderList = () => {
    if (isError) {
      return <SectionState isError onRetry={() => void refetch()} className="h-40" />;
    }

    if (isPending) {
      return SKELETON_ITEMS.map((item) => (
        <div key={item} className="mb-3 h-20 animate-pulse rounded-xl bg-[#EFEDE7]" />
      ));
    }

    if (topics.length === 0) {
      return (
        <EmptyMessage
          text={keyword ? getTopicSearchEmptyText(keyword) : TOPIC_STEP.emptyText}
          className="py-14"
        />
      );
    }

    return (
      <div role="radiogroup" aria-label={TOPIC_STEP.title}>
        {topics.map((topic, index) => (
          <SelectableBookItem
            key={topic.key}
            name={RADIO_NAME}
            value={topic.key}
            checked={selectedKey === topic.key}
            divided={isDivided(index)}
            coverUrl={topic.coverUrl}
            title={topic.title}
            author={topic.subtitle}
            onSelect={() => onSelect(topic)}
            showRadio
          />
        ))}
      </div>
    );
  };

  return (
    <section className="px-5 pt-9">
      <StepTitle title={TOPIC_STEP.title} description={TOPIC_STEP.description} />

      <SearchField
        label={TOPIC_STEP.searchLabel}
        placeholder={TOPIC_STEP.searchPlaceholder}
        value={input}
        onChange={setInput}
        onSubmit={submit}
        className="mt-6"
      />

      <div className="mt-6">{renderList()}</div>
    </section>
  );
}

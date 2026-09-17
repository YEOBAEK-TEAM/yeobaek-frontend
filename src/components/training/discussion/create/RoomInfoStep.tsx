import { useId } from "react";

import FormField from "@/components/training/discussion/create/FormField";
import SelectedTopicCard from "@/components/training/discussion/create/SelectedTopicCard";
import StepTitle from "@/components/training/discussion/create/StepTitle";
import TagInput from "@/components/training/discussion/create/TagInput";
import VisibilityOption from "@/components/training/discussion/create/VisibilityOption";
import {
  ROOM_DESCRIPTION_MAX_LENGTH,
  ROOM_FIELD_CLASS,
  ROOM_INFO_STEP,
  ROOM_TAG_MAX_COUNT,
  ROOM_TITLE_MAX_LENGTH,
  ROOM_VISIBILITY_OPTIONS,
} from "@/constants/training/discussion/room";
import { useRoomCreateStore } from "@/stores/training/discussion/roomCreate";

export default function RoomInfoStep() {
  const fieldId = useId();

  const topic = useRoomCreateStore((state) => state.topic);
  const title = useRoomCreateStore((state) => state.title);
  const tags = useRoomCreateStore((state) => state.tags);
  const description = useRoomCreateStore((state) => state.description);
  const visibility = useRoomCreateStore((state) => state.visibility);

  const setTitle = useRoomCreateStore((state) => state.setTitle);
  const addTag = useRoomCreateStore((state) => state.addTag);
  const removeTag = useRoomCreateStore((state) => state.removeTag);
  const setDescription = useRoomCreateStore((state) => state.setDescription);
  const setVisibility = useRoomCreateStore((state) => state.setVisibility);

  return (
    <section className="px-5 pt-9">
      <StepTitle title={ROOM_INFO_STEP.title} />

      {topic && (
        <div className="mt-6">
          <SelectedTopicCard topic={topic} />
        </div>
      )}

      <div className="mt-9 flex flex-col gap-5">
        <FormField
          label={ROOM_INFO_STEP.titleLabel}
          htmlFor={`${fieldId}-title`}
          hint={`${title.length}/${ROOM_TITLE_MAX_LENGTH}`}
        >
          <input
            id={`${fieldId}-title`}
            value={title}
            maxLength={ROOM_TITLE_MAX_LENGTH}
            placeholder={ROOM_INFO_STEP.titlePlaceholder}
            autoComplete="off"
            onChange={(event) => setTitle(event.target.value)}
            className={`${ROOM_FIELD_CLASS} h-13.5`}
          />
        </FormField>

        <FormField
          label={ROOM_INFO_STEP.tagLabel}
          htmlFor={`${fieldId}-tag`}
          hint={`${tags.length}/${ROOM_TAG_MAX_COUNT}`}
        >
          <TagInput
            id={`${fieldId}-tag`}
            describedBy={`${fieldId}-tag-hint`}
            tags={tags}
            onAdd={addTag}
            onRemove={removeTag}
          />

          <p id={`${fieldId}-tag-hint`} className="mt-1.5 px-1 text-[12px] text-[#A8ABB2]">
            {ROOM_INFO_STEP.tagHint}
          </p>
        </FormField>

        <FormField label={ROOM_INFO_STEP.descriptionLabel} htmlFor={`${fieldId}-description`}>
          <div className="relative">
            <textarea
              id={`${fieldId}-description`}
              aria-describedby={`${fieldId}-description-count`}
              value={description}
              maxLength={ROOM_DESCRIPTION_MAX_LENGTH}
              placeholder={ROOM_INFO_STEP.descriptionPlaceholder}
              onChange={(event) => setDescription(event.target.value)}
              className={`${ROOM_FIELD_CLASS} block h-22 resize-none pt-3 pb-7 leading-5.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            />

            <span
              id={`${fieldId}-description-count`}
              className="pointer-events-none absolute right-4 bottom-2 text-[15px] text-[#2C2A2B] tabular-nums"
            >
              {description.length}/{ROOM_DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
        </FormField>

        <fieldset>
          <legend className="px-1 text-[16px] font-bold text-[#4F4D4E]">
            {ROOM_INFO_STEP.visibilityLabel}
          </legend>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            {ROOM_VISIBILITY_OPTIONS.map((option) => (
              <VisibilityOption
                key={option.id}
                name={`${fieldId}-visibility`}
                value={option.id}
                checked={visibility === option.id}
                title={option.title}
                description={option.description}
                onSelect={() => setVisibility(option.id)}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  );
}

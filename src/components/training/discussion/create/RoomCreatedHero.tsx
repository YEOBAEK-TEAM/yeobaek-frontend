import RoomCreateCharacter from "@/assets/images/Debate/RoomCreateCharacter.png";
import { ROOM_CREATED } from "@/constants/training/discussion/room";

export default function RoomCreatedHero() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-48 w-full justify-center">
        {/* 캐릭터 오른쪽으로 번지는 원형 글로우 */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-[calc(50%-68px)] h-56 w-56 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,222,176,0.9)_0%,rgba(214,222,176,0.45)_40%,rgba(214,222,176,0)_70%)]"
        />

        <img
          src={RoomCreateCharacter}
          alt=""
          className="relative h-48 w-auto -translate-x-3.5 object-contain"
        />
      </div>

      <h1 className="mt-7 text-center text-[26px] font-bold text-[#2C2A2B]">
        {ROOM_CREATED.title}
      </h1>

      <p className="mt-4 text-center text-[19px] leading-[26px] whitespace-pre-line text-[#2C2A2B]">
        {ROOM_CREATED.subtitle}
      </p>
    </div>
  );
}

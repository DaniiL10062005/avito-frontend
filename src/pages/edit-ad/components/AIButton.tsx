import { LoaderCircle, RotateCcw } from "lucide-react";

type AIButtonState = "initial" | "loading" | "retry";

interface AIButtonProps {
  onClick?: () => void;
  text: string;
  icon: React.ReactNode;
  state?: AIButtonState;
}

const stateConfig: Record<
  AIButtonState,
  { text: string; icon: React.ReactNode; disabled: boolean }
> = {
  initial: {
    text: "Узнать рыночную цену",
    icon: null,
    disabled: false,
  },
  loading: {
    text: "Выполняется запрос",
    icon: <LoaderCircle className="size-4 animate-spin text-[#FFA940]" />,
    disabled: true,
  },
  retry: {
    text: "Повторить запрос",
    icon: <RotateCcw className="size-4 text-[#FFA940]" />,
    disabled: false,
  },
};

export const AIButton = ({
  onClick,
  text,
  icon,
  state = "initial",
}: AIButtonProps) => {
  const resolvedText = state === "initial" ? text : stateConfig[state].text;
  const resolvedIcon = state === "initial" ? icon : stateConfig[state].icon;
  const isDisabled = stateConfig[state].disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="flex h-8 items-center gap-1.5 rounded-md bg-[#F9F1E6] px-2 py-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xs disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
    >
      {resolvedIcon}
      <p className="text-sm text-[#FFA940]">{resolvedText}</p>
    </button>
  );
};

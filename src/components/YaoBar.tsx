interface YaoBarProps {
  isYang: boolean;
  color?: string;
}

export function YaoBar({ isYang, color = 'bg-gray-800' }: YaoBarProps) {
  if (isYang) {
    return <div className={`h-4 w-16 ${color} rounded-sm`} />;
  }

  return (
    <div className="flex justify-between w-16 h-4">
      <div className={`w-[45%] h-full ${color} rounded-sm`} />
      <div className={`w-[45%] h-full ${color} rounded-sm`} />
    </div>
  );
}

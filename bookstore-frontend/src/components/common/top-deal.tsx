import { ThumbsUp } from 'lucide-react';

const TopDeal = () => {
  return (
    <div className={`flex text-red-600 items-center gap-1 text-xs`}>
      <ThumbsUp className="h-3 w-3 fill-current" />
      <div className="font-extrabold flex text-inherit gap-0 flex-col leading-3">
        <span>TOP</span>
        <span>DEAL</span>
      </div>
    </div>
  );
};

export default TopDeal;

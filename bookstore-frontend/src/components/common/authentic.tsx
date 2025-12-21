import { CheckCircle } from 'lucide-react';

const Authentic = () => {
  return (
    <div className={`flex items-center gap-1 font-extrabold text-xs`}>
      <CheckCircle className="text-blue-600 h-4 w-4 fill-blue-600" />
      <div className="flex text-blue-600 gap-0 flex-col leading-3">
        <span>CHÍNH</span>
        <span>HÃNG</span>
      </div>
    </div>
  );
};

export default Authentic;

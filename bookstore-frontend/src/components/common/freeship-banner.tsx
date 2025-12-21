const FreeshipBanner = () => {
  return (
    <div className="bg-green-100 border border-green-200 hidden lg:block">
      <div className="max-w-6xl mx-auto px-4 py-2 text-center">
        <span className="text-green-700 text-sm">
          Freeship đơn từ 45k, giảm nhiều hơn cùng{' '}
          <span className="font-extrabold italic text-blue-600">
            FREESHIP <span className="text-green-700">XTRA</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default FreeshipBanner;

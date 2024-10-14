import React from "react";
const PaymentSymmry = () => {
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  return (
    <div
      className="w-full flex flex-col justify-center items-center bg-red-50 border-t-4 border-sky-400 "
      dir="rtl"
    >
      <div className="  md:w-10/12 w-full flex flex-col  gap-y-5  py-10 px-3">
        <span className="text-xl text-gray-800">ملخص الدفع</span>
        <div className="md:w-11/12 w-full border rounded-lg bg-white flex flex-col items-start justify-start ">
          <div className="w-full   flex flex-col  px-3 pb-3 gap-y-2 border-b my-2">
            <span className="text-gray-800 text-lg  w-full">
              رسوم تقديم الطلب
            </span>
            <span className="bg-gray-500 text-white px-2 py-1 w-fit text-xs rounded-full">
              10 ريال
            </span>
          </div>
          <div className="w-full  flex flex-col gap-3 p-2 ">
            <span className="text-gray-800 text-lg  w-full">
              رسوم الفحص الدوري
            </span>
            <span className="bg-gray-500 text-white px-2 py-1 w-fit text-xs rounded-full">
              0 ريال
            </span>
          </div>
        </div>
        <span className="w-full text-center text-gray-500">
          سوف يتم تحصيل رسوم الفحص لاحقآ عند الفحص
        </span>
        <div className="w-full flex items-center justify-center ">
          <button
            className="text-white hover:opacity-90 rounded-full min-w-48 bg-green-600 py-3 px-2 text-xl "
            onClick={() =>
              (window.location.href = "/payment-form?data=" + data)
            }
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSymmry;

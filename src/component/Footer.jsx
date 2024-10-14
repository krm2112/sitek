import React from "react";
import {  BsYoutube } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaSnapchatGhost } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="bg-gray-200 p-5 w-full flex flex-col items-center justify-center md:flex-row-reverse md:justify-evenly ">
      <div className="flex flex-col  items-center gap-3">
        <span>إدارة حجز المواعيد</span>
        <span>إتصل بنا</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <span>يمكــنك التـواصل معنـــا</span>
          <img src="/footer1.png" />
        </div>
        <span className="text-xs w-full">
          إبق على اتصال معنا عبر مواقع التواصل الإجتماعي
        </span>
        <div className="flex w-full justify-between text-gray-800 mt-5">
          <BsInstagram />
          <FaSnapchatGhost />
          <BsYoutube />
          <FaFacebook />
          <FaTwitter />
        </div>
      </div>
      <div className="flex flex-col items-center my-5 gap-3">
        <span className="text-xs">تحت إشراف</span>
        <img src="/footer2.svg" />
        <span className="text-xs">
          جميع الحقوق محفوظة – سلامة المركبات © 2021
        </span>
      </div>
    </div>
  );
};

export default Footer;

"use client";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ImportBsJS() {
  useEffect(() => {
    console.log("i'm in bootstrap js");
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return null;
}

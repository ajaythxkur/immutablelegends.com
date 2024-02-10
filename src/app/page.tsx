"use client";
import React from "react";
import "./page.css";
import { animate_text, random_color } from "@/libs/main.ts";
export default function Page() {
  
  return (
    <React.Fragment>
      <main className="main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="content text-center">
                <h2 className="text-uppercase mb-0" style={{color: random_color()}} onMouseOver={(e) => animate_text(e, "We")}>We</h2>
                <h2 className="text-uppercase mb-0" style={{color: random_color()}} onMouseOver={(e) => animate_text(e, "Are")}>Are</h2>
                <h2 className="text-uppercase mb-0" style={{color: random_color()}} onMouseOver={(e) => animate_text(e, "Legends")}>Legends</h2>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}

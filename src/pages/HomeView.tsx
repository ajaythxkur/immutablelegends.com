import React from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
export default function HomeView() {
    // gsap.registerPlugin(ScrollTrigger);
    function fixText(event: any, value: String) {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ12";
        let iterations = 0;
        const interval = setInterval(() => {
            event.target.innerText = event.target.innerText.split("").map((letter: String, index: number) => {
                letter;
                if (index < iterations) {
                    return value[index]
                }
                return letters[Math.floor(Math.random() * 26)]
            }).join("")
            if (iterations >= value.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30)

    }
    // const slider = useRef(null);
    // useLayoutEffect(()=>{
    //     let ctx = gsap.context(()=>{
    //         let panels = gsap.utils.toArray(".panel");
    //         gsap.to(panels, {
    //             xPercent: -100*(panels.length -1),
    //             ease: "none",
    //             scrollTrigger:{
    //                 trigger:slider.current,
    //                 pin:false,
    //                 scrub: 1,
    //                 snap: 1/(panels.length-1),
    //                 end:()=>"+="+ slider.current.offsetWidth,
    //                 markers: true
    //             }
    //         });
    //     })
    //     return ()=>ctx.revert()


    //   },[])
    return (
        <React.Fragment>
            <hr />
            <div className="main-container" >
                {/* ref={slider} */}
                <section className="home-sec panel">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <div className="content text-center">
                                    <h2 style={{ color: 'var(--orange)' }} onMouseOver={(e) => fixText(e, "1212")} className="text-uppercase mb-0">1212</h2>
                                    <h2 style={{ color: 'var(--blue)' }} onMouseOver={(e) => fixText(e, "LEGENDS")} className="text-uppercase mb-0">LEGENDS</h2>
                                    <h2 style={{ color: 'var(--orange)' }} onMouseOver={(e) => fixText(e, "ON")} className="text-uppercase mb-0">ON</h2>
                                    <h2 style={{ color: 'var(--blue)' }} onMouseOver={(e) => fixText(e, "APTOS")} className="text-uppercase mb-0">APTOS</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <hr />
        </React.Fragment>
    )
}
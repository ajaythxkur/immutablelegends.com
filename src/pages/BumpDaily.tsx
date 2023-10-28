import React from 'react'
const BumpDaily = () => {
  return (
    <React.Fragment>
    <hr />
        <section className='staking'>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                      <div className="staking-wrapper text-center">
                        <div className="staking-con">

                      <h2 className='mb-1'>Bump Us Daily</h2>
                        </div>
                      <h3 className='mb-2'>& <br />Earn BUMP</h3>
                      <button className="btn border-0" disabled>Bump</button>
                      <hr />
                      <p className=''>Your Bump: 0</p>
                      {/* <p className='' style={{wordBreak:'break-all'}}>Bump Wallet: 
                      <u>0xc21eef93e0188165bc9f303e7f8b7f24064db5e6981d1cd092ee4a4b84ac38af</u></p> */}
                      </div>
                    </div>
                </div>
               
            </div>
        </section>
        <hr />
    </React.Fragment>
  )
}

export default BumpDaily
